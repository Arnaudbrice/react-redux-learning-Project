import { defineConfig } from "vitest/config";
//! configures vitest to run tests in the backend project inside the src directory only
export default defineConfig({
    test: {
        include: ["src/**/*.test.ts"],
    },
});
