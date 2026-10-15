import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddTodoMutation } from "../features/todos/todoApi";
import { type TodoFormValues, todoSchema } from "../features/todos/todoSchema";

function TodoFormRHF() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
    },
  });

  const [addTodo, { isLoading, isError }] = useAddTodoMutation();

  const onSubmit = async (data: TodoFormValues) => {
    /* data={title} */
    // console.log(data);

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
        <label htmlFor="todo-title">Neue Aufgabe</label>
        <input id="todo-title" type="text" {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>
      <button disabled={isLoading} type="submit">
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      {isError && <p>Error: Todo konnte nicht hinzugefügt werden.</p>}
    </form>
  );
}

export default TodoFormRHF;
