"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import {
    AuthSession,
    AuthUser,
    clearAuthSession,
    getStoredAuthSession,
    loginUser,
    refreshSessionToken,
    subscribeToAuth,
    TOKEN_LIFETIME_MINS,
} from "@/lib/auth"
import { productKeys } from "@/lib/hooks/useFetchProducts"
import { toast } from "@/components/ui/toast"
import { SessionExpiredModal } from "./session-expired-modal"

interface AuthContextType {
    session: AuthSession | null
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    isSessionExpired: boolean
    secondsRemaining: number
    login: (username: string, password: string) => Promise<AuthSession>
    logout: () => void
    renewSession: () => Promise<boolean>
    reAuthenticate: (password: string) => Promise<boolean>
    setIsSessionExpired: (expired: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const queryClient = useQueryClient()

    const session = useSyncExternalStore(
        subscribeToAuth,
        getStoredAuthSession,
        () => null
    )

    const [manualExpired, setManualExpired] = useState(false)
    const [now, setNow] = useState(() => Date.now())

    // Prevents the expiry toast from firing more than once per expiry.
    const expiryToastShown = useRef(false)

    // Tick every second while a session exists, so `secondsRemaining` and
    // `isAutoExpired` stay accurate.
    useEffect(() => {
        if (!session) return

        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [session])

    const expiresIn = session ? session.expiresAt - now : 0
    const secondsRemaining = session
        ? Math.max(0, Math.floor(expiresIn / 1000))
        : 0

    const isAutoExpired = Boolean(session && expiresIn <= 0)
    const isSessionExpired = manualExpired || isAutoExpired

    // Fire the "Session Expired" toast exactly once per expiry event, and
    // re-arm the guard once the session is restored.
    useEffect(() => {
        if (isAutoExpired) {
            if (expiryToastShown.current) return

            expiryToastShown.current = true
            toast.add({
                title: "Session Expired",
                description:
                    "Your session has expired. Please renew or sign in again.",
                type: "warning",
            })
            return
        }

        expiryToastShown.current = false
    }, [isAutoExpired])

    const resetExpiryState = useCallback(() => {
        setManualExpired(false)
        setNow(Date.now())
        expiryToastShown.current = false
    }, [])

    const login = useCallback(
        async (username: string, password: string) => {
            const newSession = await loginUser(
                username,
                password,
                TOKEN_LIFETIME_MINS
            )

            resetExpiryState()
            queryClient.invalidateQueries({ queryKey: productKeys.all })

            return newSession
        },
        [queryClient, resetExpiryState]
    )

    const logout = useCallback(() => {
        clearAuthSession()
        setManualExpired(false)
        expiryToastShown.current = false
        queryClient.clear()
        router.push("/login")

        toast.add({
            title: "Logged Out",
            description: "You have been signed out successfully.",
            type: "success",
        })
    }, [queryClient, router])

    const renewSession = useCallback(async (): Promise<boolean> => {
        if (!session?.refreshToken) return false

        try {
            await refreshSessionToken(session.refreshToken, TOKEN_LIFETIME_MINS)

            resetExpiryState()
            queryClient.invalidateQueries({ queryKey: productKeys.all })

            toast.add({
                title: "Session Extended",
                description:
                    "Your session has been renewed for another 1 minute.",
                type: "success",
            })

            return true
        } catch {
            setManualExpired(true)
            return false
        }
    }, [session, queryClient, resetExpiryState])

    const reAuthenticate = useCallback(
        async (password: string): Promise<boolean> => {
            if (!session?.user?.username) return false

            try {
                await loginUser(
                    session.user.username,
                    password,
                    TOKEN_LIFETIME_MINS
                )

                resetExpiryState()
                queryClient.invalidateQueries({ queryKey: productKeys.all })

                toast.add({
                    title: "Session Restored",
                    description:
                        "You are re-authenticated. All page data and inputs are preserved.",
                    type: "success",
                })

                return true
            } catch {
                return false
            }
        },
        [session, queryClient, resetExpiryState]
    )

    // Redirect unauthenticated users away from protected routes.
    useEffect(() => {
        const isPublicRoute = pathname === "/login"
        const isAuthenticated = Boolean(session?.accessToken)

        if (!isAuthenticated && !isPublicRoute) {
            const currentPath =
                typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : pathname

            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        }
    }, [session, pathname, router])

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isAuthenticated: Boolean(session?.accessToken),
                isLoading: false,
                isSessionExpired,
                secondsRemaining,
                login,
                logout,
                renewSession,
                reAuthenticate,
                setIsSessionExpired: setManualExpired,
            }}
        >
            {children}

            {isSessionExpired && session && (
                <SessionExpiredModal
                    user={session.user}
                    onReAuthenticate={reAuthenticate}
                    onRenew={renewSession}
                    onLogout={logout}
                />
            )}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
   
    return context
}