import { render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { describe, expect, it } from "vitest";
import App from "../App";
import userEvent from "@testing-library/user-event";

function TestBackButton() {
  const navigate = useNavigate();

  return <button onClick={() => navigate(-1)}>Back</button>;
}

describe("App routing", () => {
  it("should render the Loginpage at /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { name: "Login" });

    expect(heading).toBeInTheDocument();
  });

  it("should render NotFoundPage for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { name: "Not Found" });
    expect(heading).toBeInTheDocument();
  });

  it("should navigate from RegisterPage to LoginPage", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { name: "Register" });
    expect(heading).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "Login" });

    await user.click(loginLink);

    const loginHeader = screen.getByRole("heading", { name: "Login" });
    expect(loginHeader).toBeInTheDocument();
  });
  it("should navigate to  RegisterPage back", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <div>
          <App />
          <TestBackButton />
        </div>
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { name: "Register" });
    expect(heading).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: "Login" });

    await user.click(loginLink);

    const loginHeader = screen.getByRole("heading", { name: "Login" });
    expect(loginHeader).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: "Back" });

    await user.click(backButton);

    expect(
      screen.getByRole("heading", { name: "Register" }),
    ).toBeInTheDocument();
  });
});
