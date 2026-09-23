import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "../../app/store";

//! selector-Funktionen definieren, um bestimmte Daten aus dem Redux-Store-State auszuwählen oder daraus neuen Werten zu berechnen (derived state)
export const selectTodos = (state: RootState) => state.todos.items;

export const selectFilter = (state: RootState) => state.todos.filter;

/* export const selectFilteredTodos = (state: RootState) => {
  const todos = selectTodos(state);
  const filter = selectFilter(state);
  if (filter === "Alle") {
    return todos;
  } else if (filter === "Offen") {
    return todos.filter((todo) => todo.completed === false);
  } else {
    return todos.filter((todo) => todo.completed === true);
  }
}; */

/* selectTodos(state)
      ↓
    todos ─────────┐
                   │
                   ├──→ Result Function → filteredTodos
                   │
    filter ────────┘
      ↑
selectFilter(state) */

/* useEffect                         createSelector

Dependency Array                 Input Selectors
[a, b]                           [selectTodos, selectFilter]
  ↓                                      ↓
Änderungen relevant              Ergebnisse relevant */

export const selectFilteredTodos = createSelector(
  // only if the result of the selector functions (here named input selectors) change, the result function will be called again(memoized)([...] is like a dependency array)
  [selectTodos, selectFilter], //selectTodos und selectFilter werden hier Input Selectors und nicht selectors genannt, da ihre Ergebnisse als input für die result-Funktion dienen
  (todos, filter) => {
    //result function: receives the results of the input selectors as arguments and returns the derived data
    if (filter === "Alle") {
      return todos;
    } else if (filter === "Offen") {
      return todos.filter((todo) => todo.completed === false);
    } else {
      return todos.filter((todo) => todo.completed === true);
    }
  },
);

export const selectLoading = (state: RootState) => state.todos.loading;

export const selectError = (state: RootState) => state.todos.error;
