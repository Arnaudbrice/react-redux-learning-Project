import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ToggleTodoInput, type CreateTodoInput, type Todo } from "../../types";

// create an api slice(server slice) to fetch und manage server state (inclusive cache) on the browser. RTK Query generates automatically the corresponding actions(by mutation for instance "todoApi/executeMutation/pending" and by query for instance "todoApi/executeQuery/pending" ), reducer,middleware and hooks for the api slice.
export const todoApi = createApi({
  reducerPath: "todoApi", //redux store key for RTK QUERY state(inclusive cache=clientseitig Zwischenspeicherung von Server Daten )

  //! fetchBaseQuery sends HTTP requests for queries and mutations, serializes request body, and parses response as JSON by default.
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  tagTypes: ["Todos"], //! Defines the tag types that can be used for cache invalidation
  endpoints: (builder) => {
    return {
      // getTodos is a rtk query endpoint
      getTodos: builder.query<Todo[], void>({
        query: () => "todos", //define the url path to be append to the baseUrl
        /*  providesTags: ["Todos"], //! Associates the cached result of this query endpoint with the "Todos" tag (assoziere das Ergebnis der Query-Endpoint mit dem Tag "Todos") */
        providesTags: (result) => {
          //result ist das erfolgreiche Ergebnis der getTodos Query-Endpoint
          if (result) {
            const mappedResult = result.map((todo) => ({
              id: todo.id,
              type: "Todos" as const,
            }));
            /*
            [
              { id: "LIST", type: "Todos" },  // Tag: Todos/LIST
              { id: 1, type: "Todos" },       // Tag: Todos/1
              { id: 2, type: "Todos" },       // Tag: Todos/2
              { id: 3, type: "Todos" },       // Tag: Todos/3
              ...
            ] */
            return [{ id: "LIST", type: "Todos" as const }, ...mappedResult];
          }
          return [{ id: "LIST", type: "Todos" as const }];
        }, //! Associates the cached result of this query endpoint with the "Todos" tag (assoziere das Ergebnis der Query-Endpoint mit dem Tag "Todos")
      }),

      getTodo: builder.query<Todo, number>({
        query: (id) => `todos/${id}`,
        providesTags: (result) => {
          return result ? [{ id: result.id, type: "Todos" }] : [];
        },
      }),
      // deleteTodo is a rtk mutation endpoint
      deleteTodo: builder.mutation<void, number>({
        query: (id) => ({
          url: `todos/${id}`,
          method: "DELETE",
          // body (nicht notwendig bei DELETE, da wir nur die id brauchen)
        }),
        invalidatesTags: (_result, _error, arg) => [
          //!arg is the argument of the deleteTodo mutation
          { id: arg, type: "Todos" as const },
        ], //! Invalidates the cache entries assosciate with the Todos/arg (todo ID) tag; matching subscriber will refetch.
      }),
      /* Der LIST-Tag repräsentiert die Zusammensetzung der Collection. Er ist besonders wichtig bei CREATE, weil die ID des neuen Elements im bisherigen Cache noch gar nicht als Tag vorhanden sein kann */
      addTodo: builder.mutation<Todo, CreateTodoInput>({
        query: (newTodo) => ({
          url: "todos",
          method: "POST",
          body: newTodo,
        }),
        invalidatesTags: [{ id: "LIST", type: "Todos" as const }], //! Invalidates cached query results associated with the "Todos/LIST" tag; active queries are refetched
      }),
      toggleTodo: builder.mutation<Todo, ToggleTodoInput>({
        query: ({ id, completed }) => ({
          url: `todos/${id}`,
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
        /*  invalidatesTags: ["Todos"],//wird durch optimistic update ersetzt, da placeholder immer originale Daten zurückliefert bei getTodos (ohne die gemachten Änderungen), ansonsten könnte man auch optimistic update und invalidesTags: ["Todos"] kombinieren */

        //! bei einem echten persistenten Backend
        /*  invalidatesTags: (_result, _error, arg) => [
          { id: arg.id, type: "Todos" as const },
        ], */
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
  useGetTodoQuery,
} = todoApi; //object destructuring
