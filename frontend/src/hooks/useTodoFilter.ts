import { useState } from "react";
import { type Todo } from "../types";

export type Filter = "all" | "active" | "completed";

function useTodoFilter(todos: Todo[]) {
  const [filter, setFilter] = useState<Filter>("all");
  const filteredTodos: Todo[] =
    filter === "active"
      ? todos.filter((todo) => todo.completed === false)
      : filter === "completed"
        ? todos.filter((todo) => todo.completed === true)
        : todos;

  return {
    filter,
    setFilter,
    filteredTodos,
  };
}

export default useTodoFilter;
