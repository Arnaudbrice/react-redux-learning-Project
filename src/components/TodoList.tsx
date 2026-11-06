import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useToggleTodoMutation,
} from "../features/todos/todoApi";
import useTodoFilter from "../hooks/useTodoFilter";
import { Todo } from "../types";
import TodoDetails from "./TodoDetails";
import TodoFilterBar from "./TodoFilterBar";

export default function TodoList() {
  //********** state for selected todo id **********

  const [selectedTodoId, setSelectedTodoId] = useState<number | undefined>(
    undefined,
  );

  //********** state for toggling todo (array of todo ids for the disabled checkboxes) **********
  const [togglingTodoIds, setTogglingTodoIds] = useState<number[]>([]);

  //********** rtk query hooks **********
  //!(endpoint as) trigger function  und result object destructuring([toggleTodo, toggleResult])
  const [toggleTodo] = useToggleTodoMutation();

  //![deleteTodo, result] mit  result={data,isLoading, isError,error,isSuccess,....} und deleteTodo ist die Trigger-Funktion, die die Mutation auslöst
  const [deleteTodo] = useDeleteTodoMutation();

  const {
    data: todosData,
    isLoading: isTodosLoading,
    isError: isTodosError,
  } = useGetTodosQuery();

  //********** filter todo **********

  //!useTodoFilter hook
  const { filteredTodos, filter, setFilter } = useTodoFilter(todosData ?? []);

  //********** handle click on detail button **********
  const handleDetailTodo = (todoId: number) => {
    setSelectedTodoId(todoId);
  };

  //********** handle toggle todo **********
  const handleToggleTodo = async (todo: Todo) => {
    // adds this todo id to togglingTodoIds array (array of todo ids for disabled checkboxes )→avoids multiple clicks on the same checkbox before the response is received (avoids race condition)
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
      // Re-enable the checkbox after success or failure.
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
  if (isTodosLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {/* filter buttons (useTodoFilter hook) */}

      {/* active button style abhängig von dem filter, damit der aktiver Button immer noch sichtbar ist, selbst wenn irgendwo anders geklickt wird. */}
      <TodoFilterBar filter={filter} onFilterChange={setFilter} />

      {/* active button style abhängig von dem filter, damit der aktiver Button immer noch sichtbar ist, selbst wenn irgendwo anders geklickt wird. */}
      {/*  <div className="button-container">

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
      </div> */}
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
                    //! disable only this checkbox
                    disabled={togglingTodoIds.includes(todo.id)}
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

        <TodoDetails
          todoId={selectedTodoId}
          onClose={() => setSelectedTodoId(undefined)}
        />
      </div>
    </div>
  );
}
