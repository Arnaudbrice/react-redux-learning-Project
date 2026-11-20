import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RegisterPage from "../pages/RegisterPage";

describe("RegisterPage", () => {
  it("should clear password mismatch error after correction", async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    // 1. Alle vier Felder mit user.type() ausfüllen
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.type(nameInput, "Arnaud");
    await user.type(emailInput, "arnaud@example.com");
    await user.type(passwordInput, "testpassword");
    await user.type(confirmPasswordInput, "testedpassword");

    // 2. Submit-Button anklicken

    await user.click(submitButton);

    // 3. Fehlermeldung "Passwords do not match" prüfen
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Passwords do not match",
      );
      expect(passwordInput).toHaveAttribute("aria-invalid", "false");
      expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "true");
    });

    // 4. aria-invalid des Confirm-Password-Feldes prüfen

    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, "testpassword");

    await user.click(submitButton);
    await waitFor(() => {
      expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "false");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should display errors for invalid name and email", async () => {
    // Deine Implementierung

    const user = userEvent.setup();

    render(<RegisterPage />);

    // 1. Alle vier Felder mit user.type() ausfüllen
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.type(nameInput, "A");
    await user.type(emailInput, "example.com");
    await user.type(passwordInput, "testpassword");
    await user.type(confirmPasswordInput, "testpassword");

    // 2. Submit-Button anklicken

    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveAttribute("aria-invalid", "true");
      expect(emailInput).toHaveAttribute("aria-invalid", "true");

      const alerts = screen.getAllByRole("alert");

      expect(alerts).toHaveLength(2);

      expect(
        screen.getByText("Name should be at least 2 characters"),
      ).toBeInTheDocument();

      expect(screen.getByText("Invalid email")).toBeInTheDocument();

      expect(passwordInput).toHaveAttribute("aria-invalid", "false");
      expect(confirmPasswordInput).toHaveAttribute("aria-invalid", "false");
    });
  });
});
