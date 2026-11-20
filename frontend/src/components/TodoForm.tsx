import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAddTodoMutation } from "../features/todos/todoApi";

// export default function TodoForm({ onAddTodo }: TodoFormProps) {
export default function TodoForm() {
  const [addTodo, { isLoading, isError, isSuccess, reset }] =
    useAddTodoMutation();

  const [title, setTitle] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);
  //! typisierten Dispatch-Hook verwenden.
  // const dispatch = useAppDispatch();

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
    //! validation before try/catch block
    if (!trimmedTitle) {
      setValidationError("Bitte gib eine Aufgabe ein.");
      return;
    }
    try {
      /* Bei RTK Query rufst du den Query-Hook oder eine Mutation-Trigger-Funktion auf; RTK Query übernimmt das Dispatchen der zugehörigen Actions. */
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
    // deletes the validation error when the user types
    setValidationError(null);

    //! resets the state of the mutation hook when the mutation is successful or when the mutation fails to remove success or error messages
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
            // screenreader-text
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

      {validationError && <p style={{ color: "red" }}>{validationError}</p>}
    </div>
  );
}
