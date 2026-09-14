export interface AuthUser {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    gender?: string
    image?: string
}

export interface AuthSession {
    user: AuthUser
    accessToken: string
    refreshToken: string
    expiresAt: number // Timestamp in ms
}

const AUTH_STORAGE_KEY = "stock_console_auth_session"
export const TOKEN_LIFETIME_MINS = 1 // 1 minute as specified in requirements

export async function loginUser(
    username: string,
    password: string,
    expiresInMins: number = TOKEN_LIFETIME_MINS
): Promise<AuthSession> {
    const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username.trim(),
            password,
            expiresInMins,
        }),
    })

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Invalid credentials (${response.status})`)
    }

    const data = await response.json()

    // Normalize access and refresh tokens from DummyJSON response
    const accessToken = data.accessToken || data.token
    const refreshToken = data.refreshToken || data.token
    const expiresAt = Date.now() + expiresInMins * 60 * 1000

    const session: AuthSession = {
        user: {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
        },
        accessToken,
        refreshToken,
        expiresAt,
    }

    saveAuthSession(session)
    return session
}

export async function refreshSessionToken(
    refreshToken: string,
    expiresInMins: number = TOKEN_LIFETIME_MINS
): Promise<AuthSession> {
    const response = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            refreshToken,
            expiresInMins,
        }),
    })

    if (!response.ok) {
        throw new Error("Session refresh failed")
    }

    const data = await response.json()
    const current = getStoredAuthSession()

    if (!current) {
        throw new Error("No active session to refresh")
    }

    const newSession: AuthSession = {
        ...current,
        accessToken: data.accessToken || data.token || current.accessToken,
        refreshToken: data.refreshToken || current.refreshToken,
        expiresAt: Date.now() + expiresInMins * 60 * 1000,
    }

    saveAuthSession(newSession)
    return newSession
}

let memorySession: AuthSession | null = null
let isInitialized = false

export function getStoredAuthSession(): AuthSession | null {
    if (typeof window === "undefined") return null
    if (isInitialized) return memorySession
    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY)
        memorySession = stored ? JSON.parse(stored) : null
        isInitialized = true
        return memorySession
    } catch {
        return null
    }
}

export function saveAuthSession(session: AuthSession | null) {
    memorySession = session
    isInitialized = true
    if (typeof window === "undefined") return
    try {
        if (session) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
            // Also store a lightweight cookie for middleware / server compatibility
            document.cookie = `auth_token=${session.accessToken}; path=/; max-age=${TOKEN_LIFETIME_MINS * 60}; SameSite=Lax`
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY)
            document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax"
        }
        window.dispatchEvent(new CustomEvent("auth_changed", { detail: session }))
    } catch (e) {
        console.error("Failed to store auth session", e)
    }
}

export function subscribeToAuth(callback: () => void) {
    if (typeof window === "undefined") return () => {}
    const handler = () => {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY)
            memorySession = stored ? JSON.parse(stored) : null
            isInitialized = true
        } catch {
            memorySession = null
        }
        callback()
    }
    window.addEventListener("auth_changed", handler)
    window.addEventListener("storage", handler)
    return () => {
        window.removeEventListener("auth_changed", handler)
        window.removeEventListener("storage", handler)
    }
}

export function clearAuthSession() {
    saveAuthSession(null)
}