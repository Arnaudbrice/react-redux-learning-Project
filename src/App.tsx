import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

import RegisterPage from "./pages/RegisterPage";
import TodosPage from "./pages/TodosPage";

import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/*********** protected routes ********** */}
        <Route element={<ProtectedRoute status="authenticated" />}>
          <Route path="todos" element={<TodosPage />} />
        </Route>
        {/*********** Not Found Route ********** */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
