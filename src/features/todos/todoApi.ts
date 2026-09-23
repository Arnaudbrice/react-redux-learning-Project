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
          url: `todos/${id}`,
          method: "PATCH",
          body: { completed },
        }),
        invalidatesTags: ["Todos"],
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
