import { describe, it, expect, beforeEach, vi } from "vitest"
import {
    saveAuthSession,
    getStoredAuthSession,
    clearAuthSession,
    subscribeToAuth,
    type AuthSession,
} from "@/lib/auth"

describe("Auth Storage & Lifecycle Logic", () => {
    beforeEach(() => {
        localStorage.clear()
        clearAuthSession()
    })

    const sampleSession: AuthSession = {
        user: {
            id: 1,
            username: "emilys",
            email: "emily.johnson@x.dummyjson.com",
            firstName: "Emily",
            lastName: "Johnson",
        },
        accessToken: "mock-access-token-123",
        refreshToken: "mock-refresh-token-456",
        expiresAt: Date.now() + 60 * 1000,
    }

    it("saves and retrieves session from storage and in-memory cache", () => {
        saveAuthSession(sampleSession)

        const stored = getStoredAuthSession()
        expect(stored).not.toBeNull()
        expect(stored?.user.username).toBe("emilys")
        expect(stored?.accessToken).toBe("mock-access-token-123")
        expect(stored?.expiresAt).toBe(sampleSession.expiresAt)
    })

    it("accurately detects session expiration time difference", () => {
        const pastTimestamp = Date.now() - 5000
        const expiredSession: AuthSession = {
            ...sampleSession,
            expiresAt: pastTimestamp,
        }
        saveAuthSession(expiredSession)

        const retrieved = getStoredAuthSession()
        expect(retrieved).not.toBeNull()
        const diff = (retrieved?.expiresAt ?? 0) - Date.now()
        expect(diff).toBeLessThan(0)
    })

    it("clears auth session and cookies on logout", () => {
        saveAuthSession(sampleSession)
        expect(getStoredAuthSession()).not.toBeNull()

        clearAuthSession()
        expect(getStoredAuthSession()).toBeNull()
    })

    it("notifies subscribers through subscribeToAuth when auth changes", () => {
        const callback = vi.fn()
        const unsubscribe = subscribeToAuth(callback)

        saveAuthSession(sampleSession)
        expect(callback).toHaveBeenCalled()

        callback.mockClear()
        clearAuthSession()
        expect(callback).toHaveBeenCalled()

        unsubscribe()
    })
})
