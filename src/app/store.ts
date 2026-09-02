import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "../features/todos/todoSlice";

// erstellt einen redux store
/* Store = zentraler Speicher für den globalen State.
Der Store verwaltet den State und leitet Actions an die Reducer weiter. */
export const store = configureStore({
  reducer: {
    todos: todosReducer, //todos ist ein Store-Key, das man benutzen kann, um an den Wert von einem bestimmten state-Slice zu gelangen (state.todos.items)
  },
});

// store.getState liefert den gesamten aktuellen Redux-State.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
