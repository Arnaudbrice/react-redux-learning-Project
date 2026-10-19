import { render, type RenderOptions } from "@testing-library/react";

import { Provider } from "react-redux";
import type { ReactElement, ReactNode } from "react";

import { setupStore, type AppStore } from "../app/store";

// Render-Optionen (container, baseElement,usw..) auch bei Bedarf selbst bereitstellen und wrapper neu definieren
type TestRenderOptions = Omit<RenderOptions, "wrapper">;

function renderWithProviders(
  ui: ReactElement,
  store: AppStore = setupStore(),
  options: TestRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, {
      ...options,
      wrapper: Wrapper,
    }),
  };
}

export default renderWithProviders;
