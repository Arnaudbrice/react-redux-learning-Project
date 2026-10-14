import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().trim().min(1, "Bitte gib eine Aufgabe ein."),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
