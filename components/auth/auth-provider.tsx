"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
    AuthSession,
    AuthUser,
    getStoredAuthSession,
    loginUser,
    refreshSessionToken,
    clearAuthSession,
    saveAuthSession,
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

    const [session, setSession] = useState<AuthSession | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSessionExpired, setIsSessionExpired] = useState(false)
    const [secondsRemaining, setSecondsRemaining] = useState<number>(TOKEN_LIFETIME_MINS * 60)

    // Initial load from storage
    useEffect(() => {
        const stored = getStoredAuthSession()
        if (stored) {
            // Check if already expired
            const diff = stored.expiresAt - Date.now()
            if (diff > 0) {
                setSession(stored)
                setSecondsRemaining(Math.max(0, Math.floor(diff / 1000)))
            } else {
                // Token already expired upon app open
                setSession(stored)
                setIsSessionExpired(true)
                setSecondsRemaining(0)
            }
        }
        setIsLoading(false)

        const handleAuthChanged = (e: Event) => {
            const custom = e as CustomEvent<AuthSession | null>
            setSession(custom.detail)
            if (custom.detail) {
                const diff = custom.detail.expiresAt - Date.now()
                setSecondsRemaining(Math.max(0, Math.floor(diff / 1000)))
                setIsSessionExpired(diff <= 0)
            } else {
                setSecondsRemaining(0)
                setIsSessionExpired(false)
            }
        }

        window.addEventListener("auth_changed", handleAuthChanged)
        return () => window.removeEventListener("auth_changed", handleAuthChanged)
    }, [])

    // Background session countdown & expiry detector
    useEffect(() => {
        if (!session) return

        const timer = setInterval(() => {
            const timeLeftMs = session.expiresAt - Date.now()
            const secs = Math.max(0, Math.floor(timeLeftMs / 1000))
            setSecondsRemaining(secs)

            if (timeLeftMs <= 0) {
                // Token has expired!
                if (!isSessionExpired) {
                    setIsSessionExpired(true)
                    toast.add({
                        title: "Session Expired (1 min limit)",
                        description: "Your 1-minute test token has expired. Please re-authenticate to continue seamlessly.",
                        type: "error",
                    })
                }
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [session, isSessionExpired])

    // Login action
    const login = useCallback(
        async (username: string, password: string) => {
            const newSession = await loginUser(username, password, TOKEN_LIFETIME_MINS)
            setSession(newSession)
            setIsSessionExpired(false)
            setSecondsRemaining(TOKEN_LIFETIME_MINS * 60)
            queryClient.invalidateQueries({ queryKey: productKeys.all })
            return newSession
        },
        [queryClient]
    )

    // Logout action
    const logout = useCallback(() => {
        clearAuthSession()
        setSession(null)
        setIsSessionExpired(false)
        setSecondsRemaining(0)
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
            const updated = await refreshSessionToken(session.refreshToken, TOKEN_LIFETIME_MINS)
            setSession(updated)
            setIsSessionExpired(false)
            setSecondsRemaining(TOKEN_LIFETIME_MINS * 60)
            queryClient.invalidateQueries({ queryKey: productKeys.all })
            toast.add({
                title: "Session Extended",
                description: "Your session has been renewed for another 1 minute.",
                type: "success",
            })
            return true
        } catch {
            setIsSessionExpired(true)
            return false
        }
    }, [session, queryClient])

    // In-place re-authentication
    const reAuthenticate = useCallback(
        async (password: string): Promise<boolean> => {
            if (!session?.user?.username) return false

            try {
                const newSession = await loginUser(session.user.username, password, TOKEN_LIFETIME_MINS)
                setSession(newSession)
                setIsSessionExpired(false)
                setSecondsRemaining(TOKEN_LIFETIME_MINS * 60)
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
        if (isLoading) return

        const isPublicRoute = pathname === "/login"
        const isAuth = Boolean(session?.accessToken)

        if (!isAuth && !isPublicRoute) {
            const redirectUrl = encodeURIComponent(pathname)
            router.push(`/login?redirect=${redirectUrl}`)
        }
    }, [session, isLoading, pathname, router])

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                isAuthenticated: Boolean(session?.accessToken),
                isLoading,
                isSessionExpired,
                secondsRemaining,
                login,
                logout,
                renewSession,
                reAuthenticate,
                setIsSessionExpired,
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
