import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import renderWithProviders from "../test/renderWithProviders";
import { server } from "../test/server";
import TodoList from "./TodoList";
import { ToggleTodoInput, type Todo } from "../types";

type PatchBody = Pick<ToggleTodoInput, "completed">;

describe("TodoList", () => {
  it("führt bei HTTP 500 einen Rollback aus", async () => {
    const user = userEvent.setup();

    let resolvePromise!: () => void;

    const pendingPatch = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    // TODO 1: GET /todos mit MSW mocken

    let patchCount = 0;

    server.use(
      http.get("http://localhost:3001/todos", () => {
        return HttpResponse.json([
          {
            id: 1,
            title: "React lernen",
            completed: false,
          },
        ]);
      }),

      http.patch("http://localhost:3001/todos/:id", async () => {
        patchCount++;
        await pendingPatch;
        return HttpResponse.json(
          {
            message: "Internal Server Error",
          },
          { status: 500 },
        );
      }),
    );

    // TODO 2: PATCH /todos/:id mocken
    // await delay(500) vor der HTTP-500-Antwort

    // TODO 3: TodoList rendern

    renderWithProviders(<TodoList />);

    screen.logTestingPlaygroundURL();

    // TODO 4: Checkbox suchen
    // Anfangszustand: unchecked

    const checkbox = await screen.findByRole("checkbox", {
      name: /react lernen/i,
    });

    expect(checkbox).not.toBeChecked();

    // TODO 5: Checkbox anklicken
    // Optimistischen Zustand: checked prüfen

    await user.click(checkbox);

    await waitFor(() => {
      expect(patchCount).toBe(1);
    });

    expect(checkbox).toBeChecked();
    // TODO 6: Mit waitFor den Rollback prüfen

    resolvePromise();

    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });
  });

  //**********************************************

  it("maintains the Optimistic Update after a successful PATCH", async () => {
    const user = userEvent.setup();

    let resolvePatchPromise!: () => void;

    const pendingPatch = new Promise<void>((resolve) => {
      resolvePatchPromise = resolve;
    });

    let todo: Todo = {
      id: 1,
      title: "React lernen",
      completed: false,
    };

    let patchCount = 0;

    let getCount = 0;

    server.use(
      http.get("http://localhost:3001/todos", () => {
        getCount++;
        return HttpResponse.json([todo]);
      }),
      http.patch("http://localhost:3001/todos/:id", async ({ request }) => {
        patchCount++;

        const parsedBody = (await request.json()) as PatchBody;
        await pendingPatch;

        todo = {
          ...todo,
          title: "react lernen neu", //title can only displayed after a refetch
          completed: parsedBody.completed,
        };

        return HttpResponse.json(todo);
      }),
    );

    renderWithProviders(<TodoList />);

    await waitFor(() => {
      expect(getCount).toBe(1);
    });

    const checkbox = await screen.findByRole("checkbox", {
      name: /react lernen/i,
    });

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);

    await waitFor(() => {
      expect(patchCount).toBe(1);
    });

    expect(checkbox).toBeChecked();

    resolvePatchPromise();

    // only visible after a refetch
    expect(await screen.findByText("react lernen neu")).toBeInTheDocument();

    expect(getCount).toBe(2);
    expect(todo.completed).toBe(true);
    expect(
      screen.getByRole("checkbox", {
        name: /react lernen neu/i,
      }),
    ).toBeChecked();
  });
});
