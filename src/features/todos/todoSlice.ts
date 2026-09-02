import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../../types";

// literal type for the filter state
type Filter = "Alle" | "Offen" | "Erledigt";
type TodoStateType = {
  items: Todo[];
  filter: Filter;
};

const initialState: TodoStateType = {
  items: [],
  filter: "Alle",
};

// Slice: Ein Bereich im Store (z.B. auth oder cart). Es bündelt den initialen Zustand, die Reducer und die Actions an einem Ort.
const todoSlice = createSlice({
  name: "todoList", // Name des Slices
  // Wird u.a. für Action Types wie "todoList/addTodo" verwendet.
  initialState,
  reducers: {
    // Hier wird die Reducer-Logik definiert.
    // Redux Toolkit erzeugt daraus automatisch die passenden Action Creator.
    addTodo: (state, action: PayloadAction<string>) => {
      const todo: Todo = {
        id: Date.now(),
        title: action.payload,
        completed: false,
      };
      state.items.push(todo); //!RTK verwendet im Hintergrund Immer.js, damit der Redux-State immutable aktualisiert wird
    },

    // Hier wird die Reducer-Logik definiert.
    // Redux Toolkit erzeugt daraus automatisch die passenden Action Creator.
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((todo) => todo.id === action.payload);

      if (todo) {
        todo.completed = !todo.completed;
      }
    },

    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearTodos: (state) => {
      state.items = [];
    },

    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});
export default todoSlice.reducer;

// Action Creator exportieren, damit später
// dispatch(addTodo("Redux lernen")) verwendet werden kann.
export const { addTodo, toggleTodo, deleteTodo, clearTodos, setFilter } =
  todoSlice.actions;
