import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute";

//! creates a test component to probe the pathname
function LocationProbe() {
  const { pathname } = useLocation();

  return <p data-testid="pathname">{pathname}</p>;
}

describe("ProtectedRoute", () => {
  //********** tests protected route **********
  it("should render protected page if user is authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <Routes>
          <Route element={<ProtectedRoute status="authenticated" />}>
            <Route path="todos" element={<h1>Todos</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Todos" })).toBeInTheDocument();
  });

  ///********** tests unauthenticated **********
  it("should redirect unauthenticated users to login", () => {
    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <Routes>
          <Route element={<ProtectedRoute status="unauthenticated" />}>
            <Route path="todos" element={<h1>Todos</h1>} />
          </Route>
          <Route path="login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Todos" }),
    ).not.toBeInTheDocument();
  });

  //********** test the loading state **********
  it("should show loading state without redirecting", () => {
    render(
      <MemoryRouter initialEntries={["/todos"]}>
        <Routes>
          <Route element={<ProtectedRoute status="loading" />}>
            <Route path="todos" element={<h1>Todos</h1>} />
          </Route>

          <Route path="login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/authentifizierung/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /todos/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  //********** tests the state change (loading to authenticated) **********
  it("should display the todo page after the state change from loading to authenticated", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/todos"]}>
        <Routes>
          <Route element={<ProtectedRoute status="loading" />}>
            <Route path="todos" element={<h1>todos</h1>} />
          </Route>

          <Route path="login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/authentifizierung/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Todos" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Login" }),
    ).not.toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={["/todos"]}>
        <Routes>
          <Route element={<ProtectedRoute status="authenticated" />}>
            <Route path="todos" element={<h1>Todos</h1>} />
          </Route>
          <Route path="login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Todos" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Login" }),
    ).not.toBeInTheDocument();
  });

  //********** checks that react router is not navigated by mistake to /login during authentification check **********
  it("should have the same pathname during authentication check", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/todos"]}>
        <LocationProbe />
        <Routes>
          <Route element={<ProtectedRoute status="loading" />}>
            <Route path="todos" element={<h1>Todos</h1>} />
          </Route>

          <Route path="login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    //! checks that the pathname is exactly /todos (^is the start of the text and $ is the end of the text)
    expect(screen.getByTestId("pathname")).toHaveTextContent(/^\/todos$/);

    rerender(
      <MemoryRouter initialEntries={["/todos"]}>
        <LocationProbe />
        <Routes>
          <Route element={<ProtectedRoute status="authenticated" />}>
            <Route path="todos" element={<h1>Todos</h1>} />
          </Route>

          <Route path="login" element={<h1>Login</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    //! checks that the pathname is exactly /todos(^is the start of the text and $ is the end of the text)
    expect(screen.getByTestId("pathname")).toHaveTextContent(/^\/todos$/);

    expect(screen.getByRole("heading", { name: "Todos" })).toBeInTheDocument();
  });
});
