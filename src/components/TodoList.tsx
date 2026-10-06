import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useDeleteTodoMutation,
  useGetTodoQuery,
  useGetTodosQuery,
  useToggleTodoMutation,
} from "../features/todos/todoApi";
import { selectFilter } from "../features/todos/todoSelectors";
import { setFilter } from "../features/todos/todoSlice";
import { Todo } from "../types";

export default function TodoList() {
  //********** state for selected todo id **********

  const [selectedTodoId, setSelectedTodoId] = useState<number | undefined>(
    undefined,
  );
  //********** state for toggling todo **********
  const [togglingTodoIds, setTogglingTodoIds] = useState<number[]>([]);

  //********** rtk query hooks **********
  //!(endpoint as) trigger function  und result object destructuring
  const [toggleTodo, toggleResult] = useToggleTodoMutation();

  // aktueller items state aus dem redux store lesen
  // const todos = useAppSelector((state) => state.todos.items);
  // const todos = useAppSelector(selectTodos);
  // aktueller filter state aus dem redux store lesen
  // const filter = useAppSelector((state) => state.todos.filter);
  //![deleteTodo, result] mit  result={data,isLoading, isError,error,isSuccess,....} und deleteTodo ist die Trigger-Funktion, die die Mutation auslöst
  const [deleteTodo] = useDeleteTodoMutation();

  const {
    data: todosData,
    isLoading: isTodosLoading,
    isError: isTodosError,
  } = useGetTodosQuery();

  //! conditional fetching using skipToken, um die Abfrage zu überspringen, wenn selectedTodoId undefined ist ({ data: todoData, isUninitialized } )
  const {
    data: todoData,
    isLoading: isTodoLoading,
    isFetching: isTodoFetching,
    isError: isTodoError,
    isUninitialized: isTodoUninitialized,
    isSuccess: isTodoSuccess,
  } = useGetTodoQuery(selectedTodoId ?? skipToken);

  //********** filter todo **********
  const filter = useAppSelector(selectFilter);

  const todos = todosData ?? []; //!fallback definieren

  const filteredTodos =
    filter === "Alle"
      ? todos
      : filter === "Offen"
        ? todos.filter((item) => item.completed === false)
        : todos.filter((item) => item.completed === true);

  const dispatch = useAppDispatch();

  //********** handle click on detail button **********
  const handleDetailTodo = (todoId: number) => {
    setSelectedTodoId(todoId);
  };

  //********** handle toggle todo **********
  const handleToggleTodo = async (todo: Todo) => {
    setTogglingTodoIds((prev) => [...prev, todo.id]);
    try {
      const updatedTodo = await toggleTodo({
        id: todo.id,
        completed: !todo.completed,
      }).unwrap();
      console.log(updatedTodo);
    } catch (err) {
      console.error(err);
    } finally {
      // nach Erfolg oder Fehler, checkbox wieder anklickbar machen
      setTogglingTodoIds((prev) => prev.filter((id) => id !== todo.id));
    }
  };

  //********** handle delete todo **********
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id).unwrap();
      console.log("todo deleted");
    } catch (error) {
      console.error(error);
    }
  };

  console.log("filter", filter);

  if (isTodosError) {
    return <div>Error: Todos konnten nicht geladen werden.</div>;
  }
  if (isTodosLoding) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="button-container">
        {/* active button style abhängig von dem filter, damit der aktiver Button immer noch sichtbar ist, selbst wenn irgendwo anders geklickt wird. */}
        <button
          className={filter === "Alle" ? "active-filter" : ""}
          type="button"
          onClick={() => dispatch(setFilter("Alle"))}>
          Alle
        </button>
        <button
          className={filter === "Offen" ? "active-filter" : ""}
          type="button"
          onClick={() => dispatch(setFilter("Offen"))}>
          Offen
        </button>
        <button
          className={filter === "Erledigt" ? "active-filter" : ""}
          type="button"
          onClick={() => dispatch(setFilter("Erledigt"))}>
          Erledigt
        </button>
      </div>
      <div className="todo-list-container">
        {filteredTodos.length === 0 ? (
          <p className="empty-state">
            Noch keine Todos für die ausgewählte Filterung vorhanden.
          </p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    disabled={
                      toggleResult.isLoading &&
                      togglingTodoIds.includes(todo.id)
                    }
                    onChange={() => handleToggleTodo(todo)}
                  />
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.title}
                  </span>
                </label>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => handleDeleteTodo(todo.id)}>
                  Löschen
                </button>
                <button
                  className="detail-button"
                  type="button"
                  onClick={() => handleDetailTodo(todo.id)}>
                  Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
