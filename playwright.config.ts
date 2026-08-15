import { defineConfig, devices } from "@playwright/test";

// End to end tests against the real app. The API is stubbed with route
// interception, so the suite needs no backend and no database.
export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? "line" : "list",
    use: {
        baseURL: "http://127.0.0.1:4173",
        // The app picks its language from the browser, its users are in Spanish
        locale: "es-ES",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                // Normally Playwright uses the browser it installs. Set
                // PLAYWRIGHT_CHROMIUM_PATH to point it at another one
                launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
                    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
                    : {},
            },
        },
    ],
    webServer: {
        // The preview server serves the production build, the same bundle
        // that gets deployed
        // --host is load bearing: without it preview binds to localhost only,
        // which on a CI runner may resolve to ::1 and never answer on 127.0.0.1
        command: "pnpm build && pnpm preview --host 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        env: {
            VITE_API_URL: "http://127.0.0.1:4173/stub",
        },
    },
});
