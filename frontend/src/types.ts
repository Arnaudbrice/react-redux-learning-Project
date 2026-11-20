export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

/* export type CreateTodoInput = {
  title: string;
  completed: boolean;
};
 */
export type CreateTodoInput = Omit<Todo, "id">;

export type ToggleTodoInput = Omit<Todo, "title">;
