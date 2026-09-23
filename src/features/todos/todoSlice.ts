import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//! 1. Typ des States definieren
// literal type for the filter state
export type Filter = "Alle" | "Offen" | "Erledigt";

type TodoState = {
  filter: Filter;
};

//! 2. Anfangszustand festlegen
const initialState: TodoState = {
  filter: "Alle",
};

//! 3. Slice erstellen
// Slice: Ein Bereich im Store (z.B. auth oder cart). Es bündelt den initialen Zustand, die Reducer und die Actions an einem Ort.
// create a slice for client state
const todoSlice = createSlice({
  name: "todoList", // Name des Slices und action typeprefix (z.B. todoList/setFilter)
  // Wird u.a. für Action Types wie "todoList/setFilter" verwendet.
  initialState,
  reducers: {
    // Hier wird die Reducer-Logik definiert.
    // Redux Toolkit erzeugt daraus automatisch die passenden Action Creator.

    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

//! 4.Reducer und Action Creator exportieren
// export the slice reducer
export default todoSlice.reducer;

// Action Creators exportieren, damit später
// dispatch(setFilter("Offen")) verwendet werden kann.
export const { setFilter } = todoSlice.actions;
