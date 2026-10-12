import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTodoQuery } from "../features/todos/todoApi";

type TodoDetailsProps = {
  todoId: number | undefined;
  onClose: () => void;
};

function TodoDetails({ todoId, onClose }: TodoDetailsProps) {
  // TODO: RTK Query verwenden

  //! conditional fetching using skipToken, um die Abfrage zu überspringen, wenn selectedTodoId undefined ist ({ data: todoData, isUninitialized } )
  const {
    currentData: currentTodoData,
    isFetching: isTodoFetching,
    isError: isTodoError,
    isUninitialized: isTodoUninitialized,
    refetch: refetchTodo,
  } = useGetTodoQuery(todoId ?? skipToken);

  // TODO: Schließen-Button

  return (
    <section
      className="todo-details"
      style={{
        position: "relative",
        border: "1px solid black",
        padding: "10px",
      }}>
      {todoId !== undefined && (
        <button
          style={{
            position: "absolute",
            right: "0",
            top: "0px",
          }}
          type="button"
          onClick={onClose}>
          Schließen
        </button>
      )}
      {/* da wir nicht alte Daten anzeigen wollen, können wir currentData verwenden, um den aktuellen Datenstand zu erhalten und dann den neuen Datenstand zu erhalten, wenn die Abfrage erfolgreich ist. */}
      {isTodoUninitialized && <p>Wähle ein Todo aus.</p>}

      {isTodoFetching && !currentTodoData && <p>Todo wird geladen...</p>}

      {isTodoError && <p>Todo konnte nicht geladen werden.</p>}

      {currentTodoData && (
        <div>
          <p>
            {currentTodoData.id} – {currentTodoData.title} -{" "}
            {currentTodoData.completed ? "✅" : "❌"}
          </p>
        </div>
      )}
      {todoId !== undefined && !isTodoUninitialized && (
        <button
          type="button"
          disabled={isTodoFetching}
          onClick={() => {
            refetchTodo();
          }}>
          {isTodoFetching ? "Lade Todo neu..." : "Aktualisiere Todo"}
        </button>
      )}
    </section>
  );
}

export default TodoDetails;
