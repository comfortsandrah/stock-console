"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
    AuthSession,
    AuthUser,
    getStoredAuthSession,
    subscribeToAuth,
    loginUser,
    refreshSessionToken,
    clearAuthSession,
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

    const session = useSyncExternalStore(subscribeToAuth, getStoredAuthSession, () => null)
    const [manualExpired, setManualExpired] = useState(false)
    const [now, setNow] = useState<number>(() => Date.now())

    // Background session countdown & expiry detector
    useEffect(() => {
        if (!session) return

        const timer = setInterval(() => {
            setNow(Date.now())
        }, 1000)

        return () => clearInterval(timer)
    }, [session])

    const diff = session ? session.expiresAt - now : 0
    const secondsRemaining = session ? Math.max(0, Math.floor(diff / 1000)) : 0
    const isAutoExpired = Boolean(session && diff <= 0)
    const isSessionExpired = manualExpired || isAutoExpired

    // Toast notification when session expires
    useEffect(() => {
        if (session && diff <= 0 && !manualExpired) {
            toast.add({
                title: "Session Expired (1 min limit)",
                description: "Your 1-minute test token has expired. Please re-authenticate to continue seamlessly.",
                type: "error",
            })
        }
    }, [session, diff, manualExpired])

    // Login action
    const login = useCallback(
        async (username: string, password: string) => {
            const newSession = await loginUser(username, password, TOKEN_LIFETIME_MINS)
            setManualExpired(false)
            setNow(Date.now())
            queryClient.invalidateQueries({ queryKey: productKeys.all })
            return newSession
        },
        [queryClient]
    )

    // Logout action
    const logout = useCallback(() => {
        clearAuthSession()
        setManualExpired(false)
        queryClient.clear()
        router.push("/login")
        toast.add({
            title: "Logged Out",
            description: "You have been signed out successfully.",
            type: "success",
        })
    }, [queryClient, router])

    // Background token renewal (extend session by 1 min)
    const renewSession = useCallback(async (): Promise<boolean> => {
        if (!session?.refreshToken) return false

        try {
            await refreshSessionToken(session.refreshToken, TOKEN_LIFETIME_MINS)
            setManualExpired(false)
            setNow(Date.now())
            queryClient.invalidateQueries({ queryKey: productKeys.all })
            toast.add({
                title: "Session Extended",
                description: "Your session has been renewed for another 1 minute.",
                type: "success",
            })
            return true
        } catch {
            setManualExpired(true)
            return false
        }
    }, [session, queryClient])

    // In-place re-authentication
    const reAuthenticate = useCallback(
        async (password: string): Promise<boolean> => {
            if (!session?.user?.username) return false

            try {
                await loginUser(session.user.username, password, TOKEN_LIFETIME_MINS)
                setManualExpired(false)
                setNow(Date.now())
                queryClient.invalidateQueries({ queryKey: productKeys.all })
                toast.add({
                    title: "Session Restored",
                    description: "You are re-authenticated. All page data and inputs are preserved.",
                    type: "success",
                })
                return true
            } catch (err) {
                toast.add({
                    title: "Re-Authentication Failed",
                    description: err instanceof Error ? err.message : "Invalid password",
                    type: "error",
                })
                return false
            }
        },
        [session, queryClient]
    )

    // Navigation protection
    useEffect(() => {
        const isPublicRoute = pathname === "/login"
        const isAuth = Boolean(session?.accessToken)

        if (!isAuth && !isPublicRoute) {
            const fullPath =
                typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : pathname
            const redirectUrl = encodeURIComponent(fullPath)
            router.push(`/login?redirect=${redirectUrl}`)
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

            {/* In-place Session Expired Modal: Ensures user never gets a blank screen or loses state */}
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
