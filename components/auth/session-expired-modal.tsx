"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthUser } from "@/lib/auth"
import { AlertCircle, KeyRound, LogOut, RefreshCw, ShieldAlert } from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"

interface SessionExpiredModalProps {
    user: AuthUser
    onReAuthenticate: (password: string) => Promise<boolean>
    onRenew: () => Promise<boolean>
    onLogout: () => void
}

export function SessionExpiredModal({
    user,
    onReAuthenticate,
    onRenew,
    onLogout,
}: SessionExpiredModalProps) {
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password.trim()) {
            setErrorMsg("Please enter your password to continue.")
            return
        }

        setIsSubmitting(true)
        setErrorMsg(null)

        const success = await onReAuthenticate(password)
        if (!success) {
            setErrorMsg("Incorrect password. For DummyJSON demo accounts, try the demo quick-login below.")
        }
        setIsSubmitting(false)
    }

    const handleQuickRenew = async () => {
        setIsSubmitting(true)
        setErrorMsg(null)
        const success = await onRenew()
        if (!success) {
            // If refresh fails, try re-authenticating with standard demo password pattern
            const demoPass = `${user.username}pass`
            const reauthSuccess = await onReAuthenticate(demoPass)
            if (!reauthSuccess) {
                setErrorMsg("Could not refresh automatically. Please enter your password.")
            }
        }
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md border-border/80 shadow-2xl shadow-primary/5">
                <CardHeader className="text-center pb-3">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-8 ring-amber-500/5">
                        <ShieldAlert className="size-6" />
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <CardTitle className="text-lg font-bold tracking-tight">Session Expired</CardTitle>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-amber-500/30 text-amber-600 bg-amber-500/10">
                            1 min token
                        </Badge>
                    </div>
                    <CardDescription className="text-xs">
                        Your test session has ended. Re-authenticate below to continue without losing your place, filters, or unsaved work.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* User Profile Badge */}
                    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/40 p-2.5">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.username}
                                    width={40}
                                    height={40}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center font-bold text-xs text-muted-foreground">
                                    {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-foreground truncate">
                                {user.firstName} {user.lastName} ({user.username})
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* Re-Authentication Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="session-password" className="text-xs font-medium">
                                Password for {user.username}
                            </Label>
                            <Input
                                id="session-password"
                                type="password"
                                placeholder="Enter password to resume"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrorMsg(null)
                                }}
                                disabled={isSubmitting}
                                className="h-8 text-xs"
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting}
                                className="h-8 w-full gap-1.5 text-xs font-semibold"
                            >
                                <KeyRound className="size-3.5" />
                                <span>{isSubmitting ? "Authenticating..." : "Resume Current Session"}</span>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleQuickRenew}
                                disabled={isSubmitting}
                                className="h-8 w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground border-dashed"
                            >
                                <RefreshCw className={`size-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                                <span>Quick Renew (1-Click Token Refresh)</span>
                            </Button>
                        </div>
                    </form>

                    {/* Switch User / Logout */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                        <span className="text-[11px] text-muted-foreground">Not you?</span>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive hover:underline"
                        >
                            <LogOut className="size-3" />
                            <span>Sign in with another account</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
