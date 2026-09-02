import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <main className="app-shell">
      <section className="card">
        <p className="intro">
          Die Todo-App verwendet Redux Toolkit für den globalen State. Todos
          können hinzugefügt, erledigt und gelöscht werden.
        </p>

        <div className="status-box">
          <strong>Aktueller Stand:</strong> Redux Store ✅ · Todo Slice ✅ ·
          useAppSelector ✅ · useAppDispatch ✅
        </div>

        <TodoForm />
        <TodoList />
      </section>
    </main>
  );
}
