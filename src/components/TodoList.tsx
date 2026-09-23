import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useToggleTodoMutation,
} from "../features/todos/todoApi";
import { selectFilter } from "../features/todos/todoSelectors";
import { setFilter } from "../features/todos/todoSlice";
import { Todo } from "../types";

export default function TodoList() {
  //********** state for toggling todo **********
  const [togglingTodoIds, setTogglingTodoIds] = useState<number[]>([]);

  //********** rtk query hooks **********
  const [toggleTodo, toggleResult] = useToggleTodoMutation();

  // aktueller items state aus dem redux store lesen
  // const todos = useAppSelector((state) => state.todos.items);
  // const todos = useAppSelector(selectTodos);
  // aktueller filter state aus dem redux store lesen
  // const filter = useAppSelector((state) => state.todos.filter);
  //! result={data,isLoading, isError,error,isSuccess,....} und deleteTodo ist die Trigger-Funktion, die die Mutation auslöst
  const [deleteTodo, result] = useDeleteTodoMutation();

  const { data, isLoading, isError, error, isSuccess } = useGetTodosQuery();

  //********** filter todo **********
  const filter = useAppSelector(selectFilter);

  const todos = data ?? []; //fallback definieren

  const filteredTodos =
    filter === "Alle"
      ? todos
      : filter === "Offen"
        ? todos.filter((item) => item.completed === false)
        : todos.filter((item) => item.completed === true);

  const dispatch = useAppDispatch();

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

  /*  const filteredTodos =
    filter === "Alle"
      ? todos
      : filter === "Offen"
        ? todos.filter((todo) => todo.completed === false)
        : todos.filter((todo) => todo.completed === true);
 */

  /*  //! Wenn sich das Ergebnis der Selector-Funktion ändert, veranlasst useAppSelector einen neuen Render der Komponente.
  const filteredTodos = useAppSelector(selectFilteredTodos);
    // actions dispatchen
  const dispatch = useAppDispatch();

  //! Wenn sich das Ergebnis der Selector-Funktion ändert, veranlasst useAppSelector einen neuen Render der Komponente.
  const loading = useAppSelector(selectLoading);

  //! Wenn sich das Ergebnis der Selector-Funktion ändert, veranlasst useAppSelector einen neuen Render der Komponente.
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchTodos()); //re-render the component when the todos are fetched successfully and the state is updated in the store.
  }, [dispatch]); */

  console.log("filter", filter);

  if (isError) {
    return <div>Error: Todos konnten nicht geladen werden.</div>;
  }
  if (isLoading) {
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
