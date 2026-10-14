import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

  const onSubmit = (data: TodoFormValues) => {
    /* data={title} */
    console.log(data);

    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="todo-title">Neue Aufgabe</label>
        <input id="todo-title" type="text" {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default TodoFormRHF;
