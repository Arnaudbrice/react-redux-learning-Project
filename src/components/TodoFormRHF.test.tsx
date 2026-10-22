import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import renderWithProviders from "../test/renderWithProviders";
import { server } from "../test/server";
import TodoFormRHF from "./TodoFormRHF";

import { http, HttpResponse } from "msw";

describe("TodoFormRHF", () => {
  it("zeigt bei leerem Titel einen Validierungsfehler", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TodoFormRHF />);

    // 1. Submit-Button finden
    const button = screen.getByRole("button", { name: /submit/i });

    // 2. Button anklicken
    await user.click(button);

    // 3. Auf die Fehlermeldung warten
    const error = await screen.findByText(/bitte gib eine aufgabe ein/i);

    expect(error).toBeInTheDocument();
  });

  it("sendet bei leerem Titel keinen POST-Request", async () => {
    const user = userEvent.setup();

    let postCount = 0;

    server.use(
      http.post("https://jsonplaceholder.typicode.com/todos", () => {
        // C1: Zähler erhöhen
        postCount++;

        return HttpResponse.json(
          { id: 201, title: "Test", completed: false },
          { status: 201 },
        );
      }),
    );

    renderWithProviders(<TodoFormRHF />);

    // C2: Submit-Button anklicken
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // C3: Auf die Validierungsfehlermeldung  von Zod warten
    await screen.findByText(/bitte gib eine aufgabe ein/i);

    // C4: Prüfen, dass kein POST-Request gesendet wurde
    expect(postCount).toBe(0);
  });

  it("setzt das Formular nach erfolgreichem POST zurück", async () => {
    const user = userEvent.setup();

    let postCount = 0;

    server.use(
      // Wildcard '*' hilft bei absoluten vs relativen Pfaden
      http.post("https://jsonplaceholder.typicode.com/todos", () => {
        postCount++;
        return HttpResponse.json(
          { id: 1, title: "Milch Kaufen", completed: false },
          { status: 201 },
        );
      }),
    );

    renderWithProviders(<TodoFormRHF />);
    // screen.logTestingPlaygroundURL();

    const button = screen.getByRole("button", { name: /submit/i });

    const input = screen.getByRole("textbox", {
      name: /neue todo aufgabe/i,
    });

    await user.type(input, "Milch Kaufen");
    await user.click(button);
    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    expect(postCount).toBe(1);
  });

  it("sendet die korrekten Todo-Daten", async () => {
    const user = userEvent.setup();

    let receivedBody: unknown;

    // TODO 1:
    // MSW-Handler für POST auf
    // https://jsonplaceholder.typicode.com/todos
    // Request-Body mit await request.json() speichern
    // HTTP 201 zurückgeben

    server.use(
      http.post(
        "https://jsonplaceholder.typicode.com/todos",
        async ({ request }) => {
          receivedBody = await request.json();
          // console.log(receivedBody);

          return HttpResponse.json(
            { id: 1, title: "Milch kaufen", completed: false },
            { status: 201 },
          );
        },
      ),
    );

    renderWithProviders(<TodoFormRHF />);

    // screen.logTestingPlaygroundURL();

    // TODO 2:
    // Input über getByRole("textbox", ...)
    // mit seinem tatsächlichen Label finden

    const input = screen.getByRole("textbox", {
      name: /neue todo aufgabe/i,
    });

    // TODO 3:
    // "Milch kaufen" eingeben

    await user.type(input, "Milch kaufen");

    // TODO 4:
    // Submit-Button anklicken

    await user.click(
      screen.getByRole("button", {
        name: /submit/i,
      }),
    );

    // TODO 5:
    // Mit waitFor prüfen, dass der Input
    // nach erfolgreichem POST leer ist

    await waitFor(() => {
      expect(input).toHaveValue("");
    });

    // TODO 6:
    // receivedBody mit toEqual() vergleichen
    expect(receivedBody).toEqual({
      title: "Milch kaufen",
      completed: false,
    });
  });

  it("behält den Titel bei einem Serverfehler", async () => {
    const user = userEvent.setup();

    // TODO 1:
    // MSW-Handler für POST /todos registrieren.
    // HTTP 500 zurückgeben.

    server.use(
      http.post("https://jsonplaceholder.typicode.com/todos", () => {
        return HttpResponse.json(
          { message: "server error" },
          {
            status: 500,
          },
        );
      }),
    );

    renderWithProviders(<TodoFormRHF />);

    // screen.logTestingPlaygroundURL();

    // TODO 2:
    // Input und Submit-Button finden.

    const input = screen.getByRole("textbox", {
      name: /neue todo aufgabe/i,
    });

    const button = screen.getByRole("button", {
      name: /submit/i,
    });

    // TODO 3:
    // "Milch kaufen" eingeben und absenden.

    await user.type(input, "Milch kaufen");
    await user.click(button);

    // TODO 4:
    // Auf die Fehlermeldung warten.
    expect(
      await screen.findByText(/todo konnte nicht hinzugefügt werden/i),
    ).toBeInTheDocument();

    /*   await waitFor(() => {
      expect(input).toHaveValue("Milch kaufen");
    }); */

    expect(input).toHaveValue("Milch kaufen");

    // TODO 5:
    // Prüfen, dass der Input
    // weiterhin "Milch kaufen" enthält.
  });
});
