import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  clearTodos,
  deleteTodo,
  setFilter,
  toggleTodo,
} from "../features/todos/todoSlice";

export default function TodoList() {
  // aktueller items state aus dem redux store lesen
  const todos = useAppSelector((state) => state.todos.items);
  // aktueller filter state aus dem redux store lesen
  const filter = useAppSelector((state) => state.todos.filter);

  const filteredTodos =
    filter === "Alle"
      ? todos
      : filter === "Offen"
        ? todos.filter((todo) => todo.completed === false)
        : todos.filter((todo) => todo.completed === true);

  // actions dispatchen
  const dispatch = useAppDispatch();

  console.log("filter", filter);

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
                    onChange={() => dispatch(toggleTodo(todo.id))}
                  />
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.title}
                  </span>
                </label>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => dispatch(deleteTodo(todo.id))}>
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="clear-button"
        type="button"
        onClick={() => dispatch(clearTodos())}>
        Alle Löschen
      </button>
    </div>
  );
}
