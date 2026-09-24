import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ToggleTodoInput,
  type CreateTodoInput,
  type Todo,
} from "../../types.ts";

// create an api slice(server slice) to fetch und manage client side cached server state and data. RTK Query generates automatically the corresponding actions, reducer,middleware and hooks for the api slice.
export const todoApi = createApi({
  reducerPath: "todoApi", //redux store key for RTK QUERY state(inclusive cache=clientseitig Zwischenspeicherung von Server Daten )
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  tagTypes: ["Todos"], //! Defines the tag types that can be used for cache invalidation
  endpoints: (builder) => {
    return {
      // getTodos is a rtk query endpoint
      getTodos: builder.query<Todo[], void>({
        query: () => "todos", //define the url path to be append to the baseUrl
        providesTags: ["Todos"], //! Associates the cached result of this query endpoint with the "Todos" tag (assoziere das Ergebnis der Query-Endpoint mit dem Tag "Todos")
      }),
      // deleteTodo is a rtk mutation endpoint
      deleteTodo: builder.mutation<void, number>({
        query: (id) => ({
          url: `todos/${id}`,
          method: "DELETE",
          // body (nicht notwendig bei post, da wir nur die id brauchen)
        }),
        invalidatesTags: ["Todos"], //! Invalidates cached query results associated with the "Todos" tag; active queries are refetched
      }),
      addTodo: builder.mutation<Todo, CreateTodoInput>({
        query: (newTodo) => ({
          url: "todos",
          method: "POST",
          body: newTodo,
        }),
        invalidatesTags: ["Todos"],
      }),
      toggleTodo: builder.mutation<Todo, ToggleTodoInput>({
        query: ({ id, completed }) => ({
          url: `todosw/${id}`,
          method: "PATCH",
          body: { completed },
        }),

        async onQueryStarted({ id, completed }, { dispatch, queryFulfilled }) {
          //1- cache optimistic update
          const patchResult = dispatch(
            todoApi.util.updateQueryData(
              "getTodos",
              undefined,
              (draftTodos) => {
                const todo = draftTodos.find((todo) => todo.id === id);

                if (todo) {
                  todo.completed = completed;
                }
              },
            ),
          );

          try {
            //2- wait of server response from the patch request
            await queryFulfilled;
          } catch (err) {
            // 3-rollback (patch request failed)
            console.error(err);
            patchResult.undo();
          }
        },
        /*  invalidatesTags: ["Todos"],//wird durch optimistic update ersetzt, da placeholder immer originale Daten zurückliefert bei getTodos (ohne die gemachten Änderungen), ansonsten könnte man auch optimistic update und invalidesTags: ["Todos"] kombinieren (best practice)*/
      }),
    };
  },
});

// RTK Query estellt aus dem todoApi automatisch hooks .
// use+<api_opeation_name>+Query
export const {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useAddTodoMutation,
  useToggleTodoMutation,
} = todoApi; //object destructuring
