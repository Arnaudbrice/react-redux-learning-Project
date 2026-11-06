import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./server";

beforeAll(() => {
  // onUnhandledFrame: "error" hilft uns, nicht abgefangene Requests zu entdecken.
  server.listen({
    onUnhandledFrame: "error", //!mws3 onhandledError becomes onUnhandledFrame
  });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
