import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";

const user = { user_id: "1", name: "Tester", email: "tester@dyrtransportes.com" } as User;

/** A token that expires in `seconds`, signature is never checked on the client. */
const tokenExpiringIn = (seconds: number) => {
    const encode = (value: object) =>
        btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const exp = Math.floor(Date.now() / 1000) + seconds;
    return `${encode({ alg: "HS256" })}.${encode({ exp })}.firma`;
};

describe("authStore", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        useAuthStore.setState({ token: null, user: null });
    });

    afterEach(() => {
        useAuthStore.getState().logout();
    });

    it("keeps the session in sessionStorage", () => {
        useAuthStore.getState().setAuth("un-token", user);

        expect(sessionStorage.getItem("token")).toBe("un-token");
        expect(JSON.parse(sessionStorage.getItem("user") ?? "{}")).toMatchObject({
            email: user.email,
        });
        expect(useAuthStore.getState().token).toBe("un-token");
    });

    it("does not persist to localStorage without remember me", () => {
        useAuthStore.getState().setAuth("un-token", user);

        expect(localStorage.getItem("token")).toBeNull();
    });

    it("persists to localStorage with remember me", () => {
        useAuthStore.getState().setAuth("un-token", user, true);

        expect(localStorage.getItem("token")).toBe("un-token");
    });

    it("clears both storages on logout", () => {
        useAuthStore.getState().setAuth("un-token", user, true);

        useAuthStore.getState().logout();

        expect(localStorage.getItem("token")).toBeNull();
        expect(sessionStorage.getItem("token")).toBeNull();
        expect(useAuthStore.getState().token).toBeNull();
    });

    // checkTokenExpiry answers "is it expired?", true means expired. Its only
    // caller ignores the value and relies on the logout it performs.
    it("says a live token is not expired", () => {
        useAuthStore.getState().setAuth(tokenExpiringIn(3600), user);

        expect(useAuthStore.getState().checkTokenExpiry()).toBe(false);
        expect(useAuthStore.getState().token).not.toBeNull();
    });

    it("says an old token is expired and logs out", () => {
        useAuthStore.getState().setAuth(tokenExpiringIn(-10), user);

        expect(useAuthStore.getState().checkTokenExpiry()).toBe(true);
        expect(useAuthStore.getState().token).toBeNull();
        expect(sessionStorage.getItem("token")).toBeNull();
    });

    it("treats no session as expired", () => {
        expect(useAuthStore.getState().checkTokenExpiry()).toBe(true);
    });

    it("says a token that cannot be decoded is expired and logs out", () => {
        useAuthStore.getState().setAuth("no-es-un-jwt", user);

        expect(useAuthStore.getState().checkTokenExpiry()).toBe(true);
        expect(useAuthStore.getState().token).toBeNull();
    });
});
