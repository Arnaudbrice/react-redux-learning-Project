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
});
