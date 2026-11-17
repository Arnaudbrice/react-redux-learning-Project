import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { describe } from "vitest";
import LoginPage from "../pages/LoginPage";

//! formular validation test
describe("LoginPage", () => {
  it("should show an error for a short password", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "123");

    await user.click(submitButton);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /^Password must be at least 8 characters$/,
    );

    expect(passwordInput).toHaveAttribute("aria-invalid", "true");
  });
});
