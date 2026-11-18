import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import LoginPage from "../pages/LoginPage";

//! formular validation test
describe("LoginPage", () => {
  it("should show errors for invalid email and short password", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    const submitButton = screen.getByRole("button", { name: /submit/i });

    // invalid email und short password
    await user.type(emailInput, "example.com");

    await user.type(passwordInput, "123");

    await user.click(submitButton);

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(2);

      expect(screen.getByText("Invalid email address")).toBeInTheDocument();

      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  //**********************************************

  it("should show errors for valid email and short password", async () => {
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

  //**********************************************
  it("should show errors for invalid email and valid password", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(emailInput, "texample.com");

    await user.type(passwordInput, "testpassword");

    await user.click(submitButton);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /^Invalid email address$/,
    );
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });
  //**********************************************

  it("should clear validation errors after correcting inputs", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    const submitButton = screen.getByRole("button", { name: /submit/i });

    // invalid email and invalid password
    await user.type(emailInput, "example.com");

    await user.type(passwordInput, "test");

    await user.click(submitButton);

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(2);

      expect(screen.getByText("Invalid email address")).toBeInTheDocument();

      expect(
        screen.getByText("Password must be at least 8 characters"),
      ).toBeInTheDocument();
    });

    await user.clear(emailInput);
    await user.clear(passwordInput);

    // valid email and valid password
    await user.type(emailInput, "test@example.com");

    await user.type(passwordInput, "testpassword");

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(emailInput).toHaveAttribute("aria-invalid", "false");
      expect(passwordInput).toHaveAttribute("aria-invalid", "false");
    });
  });
});
