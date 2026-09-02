import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Provider } from "react-redux";
import { store } from "./app/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider wird verwendet, um den Store in den untergeordneten Komponenten von der App Komponente zu übergeben.(genauso wie bei contextProvider (context api)) */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
