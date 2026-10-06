import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "../features/todos/todoSlice";
import { todoApi } from "../features/todos/todoApi";

// erstellt einen redux store
/* Store = zentraler Speicher für den globalen State.
Der Store verwaltet den State und leitet Actions an die Reducer weiter. */
export const store = configureStore({
  // !alle reducers im store registrieren
  reducer: {
    todos: todosReducer, //todos ist ein Store-Key (wie queryKey bei TanStack Query), das man benutzen kann, um an den Wert von einem bestimmten state-Slice zu gelangen (state.todos.items)
    //! RTK reducer here
    //! The API reducer stores request status, cached query data, and errors in the Redux store.
    [todoApi.reducerPath]: todoApi.reducer, //todoApi.reducerPath="todoApi"=> [todoApi.reducerPath]=todoApi(computed property name)
  },
  /*   RTK Query middleware execute HTTP Request and manage cache*/
  //! The API middleware manages subscriptions, cache lifetime, and tag-based invalidation.
  middleware: (getDefaultMiddleware) => {
    // Die RTK-Query-Middleware wird zusätzlich zu den Standard-Middlewares registriert.
    return getDefaultMiddleware().concat(todoApi.middleware);
  },
});

// store.getState liefert den gesamten aktuellen Redux-State.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
