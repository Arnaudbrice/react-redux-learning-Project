import { type RootState } from "../../app/store";

//! selector-Funktionen definieren, um bestimmte Daten aus dem Redux-Store-State auszuwählen oder daraus neuen Werten zu berechnen (derived state)
export const selectFilter = (state: RootState) => {
  return state.todos.filter;
};
