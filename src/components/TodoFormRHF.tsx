import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddTodoMutation } from "../features/todos/todoApi";
import { TodoFormValues, todoSchema } from "../features/todos/todoSchema";

function TodoFormRHF() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema), //!ZodResolver verbindet Zod-Validierung mit react-hook-form
    defaultValues: {
      title: "",
    },
  });

  const [addTodo, { isLoading, isError }] = useAddTodoMutation();

  const onSubmit = async (data: TodoFormValues) => {
    /* data={title} */
    // console.log(data);
    // !data könnte auch value heißen (muss nicht zwingend data benannt werden)

    try {
      await addTodo({ title: data.title, completed: false }).unwrap();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="todoform-title">Neue Todo Aufgabe</label>
        <input
          id="todoform-title"
          type="text"
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {/* Zod-Validierungsfehler anzeigen */}
        {errors.title && <p id="title-error">{errors.title.message}</p>}
      </div>
      <button disabled={isLoading} type="submit">
        {isLoading ? "Submitting..." : "Submit"}
      </button>
      {/* Mutations-Fehler anzeigen */}
      {isError && (
        <p id="title-error">Error: Todo konnte nicht hinzugefügt werden.</p>
      )}
    </form>
  );
}

export default TodoFormRHF;
