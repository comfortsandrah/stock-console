"use client"

import React from "react"
import Image from "next/image"
import { LogOut, RefreshCw, Clock, ShieldAlert } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
    const { user, logout, secondsRemaining, renewSession } = useAuth()

    if (!user) return null

    const isExpiringSoon = secondsRemaining <= 20
    const mins = Math.floor(secondsRemaining / 60)
    const secs = secondsRemaining % 60
    const formattedTime = `${mins}:${secs.toString().padStart(2, "0")}`

    return (
        <div className="flex items-center gap-2">
            {/* Live Session Countdown Badge with Quick Renew */}
            <div className="flex items-center gap-1">
                <Badge
                    variant="outline"
                    className={`h-6 text-[10px] gap-1 font-mono transition-colors ${
                        isExpiringSoon
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
                            : "border-border/60 bg-background text-muted-foreground"
                    }`}
                    title="Token test lifetime (1 min)"
                >
                    {isExpiringSoon ? <ShieldAlert className="size-3 text-amber-500" /> : <Clock className="size-3" />}
                    <span>{formattedTime}</span>
                </Badge>

                <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => renewSession()}
                    className="size-6 text-muted-foreground hover:text-foreground"
                    title="Extend session (+1 min token)"
                >
                    <RefreshCw className="size-3" />
                </Button>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            className="relative h-8 gap-2 px-1.5 rounded-full hover:bg-muted/80"
                        >
                            <div className="relative size-6 shrink-0 overflow-hidden rounded-full border bg-muted">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.username}
                                        width={24}
                                        height={24}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center font-bold text-[10px] text-muted-foreground">
                                        {user.firstName?.[0] || user.username[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="hidden sm:inline text-xs font-medium text-foreground truncate max-w-[120px]">
                                {user.firstName || user.username}
                            </span>
                        </Button>
                    }
                />

                <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-xs font-semibold leading-none text-foreground">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[11px] leading-none text-muted-foreground">
                                @{user.username} &bull; {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => renewSession()} className="cursor-pointer text-xs">
                        <RefreshCw className="size-3.5 mr-2 text-muted-foreground" />
                        <span>Renew Session (+1 min)</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer text-xs text-destructive focus:text-destructive"
                    >
                        <LogOut className="size-3.5 mr-2 text-destructive" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
