import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// The app reads the API url from the environment at import time
vi.stubEnv("VITE_API_URL", "http://localhost:8080");

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
