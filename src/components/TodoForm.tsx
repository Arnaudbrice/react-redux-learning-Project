import { ChangeEvent, useState, type SubmitEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { useAddTodoMutation } from "../features/todos/todoApi";

// export default function TodoForm({ onAddTodo }: TodoFormProps) {
export default function TodoForm() {
  const [addTodo, { isLoading, isError, error, isSuccess, reset }] =
    useAddTodoMutation();

  const [title, setTitle] = useState("");
  //! typisierten Dispatch-Hook verwenden.
  const dispatch = useAppDispatch();

  /*  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
 */
  /*
    TodoForm
   │
   │ dispatch(addTodo("Redux lernen"))
   ▼
Action
   │
   ▼
Store
   │
   ▼
addTodo Reducer
   │
   ▼
state.todos.items
   │
   ▼
useAppSelector
   │
   ▼
TodoList
   │
   ▼
"Redux lernen" erscheint */
  /*    dispatch(addTodo(trimmedTitle)); //
    setTitle("");
  }  */

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    try {
      const newTodo = await addTodo({
        title: trimmedTitle,
        completed: false,
      }).unwrap();

      console.log(`${newTodo.title} added successfully`);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    if (isSuccess || isError) {
      reset();
    }
  };

  return (
    <div>
      <form className="todo-form" onSubmit={handleSubmit}>
        <label htmlFor="todo-title">Neue Aufgabe</label>
        <div className="todo-form-row">
          <input
            id="todo-title"
            value={title}
            onChange={handleChange}
            placeholder="z. B. Redux Store verstehen"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Speichern..." : "Hinzufügen"}
          </button>
        </div>
      </form>
      {isError && (
        <p style={{ color: "red" }}>Todo konnte nicht hinzugefügt werden</p>
      )}
      {isSuccess && (
        <p style={{ color: "green" }}>Todo erfolgreich hinzugefügt!</p>
      )}
    </div>
  );
}
