import { useState, type SubmitEvent } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../features/todos/todoSlice";
import { useAppDispatch } from "../app/hooks";

// export default function TodoForm({ onAddTodo }: TodoFormProps) {
export default function TodoForm() {
  const [title, setTitle] = useState("");
  //! typisierten Dispatch-Hook verwenden.
  const dispatch = useAppDispatch();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

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
    dispatch(addTodo(trimmedTitle)); //
    setTitle("");
  }

  return (
   <div>
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="todo-title">Neue Aufgabe</label>
      <div className="todo-form-row">
        <input
          id="todo-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="z. B. Redux Store verstehen"
        />
        <button type="submit">Hinzufügen</button>
      </div>
    </form>

   </div>
  );
}
