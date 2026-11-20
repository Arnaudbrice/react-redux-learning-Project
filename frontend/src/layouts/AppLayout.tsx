import { NavLink, Outlet } from "react-router";

function AppLayout() {
  return (
    <>
      <header>
        <nav aria-label="Main Navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/todos">Todos</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} · All rights reserved. Made with ❤️ by
          Brice Arnaud Habenicht
        </p>
      </footer>
    </>
  );
}

export default AppLayout;
