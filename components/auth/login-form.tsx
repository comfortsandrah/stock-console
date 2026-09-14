"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useState, Suspense } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { toast } from "../ui/toast"
import { useAuth } from "@/components/auth/auth-provider"

const formSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters."),
    password: z
        .string()
})

function LoginFormContent() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect") || "/products"
    const { login } = useAuth()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            await login(data.username, data.password)
            toast.add({
                title: "Login Successful",
                description: "You are now logged in. Welcome back, " + data.username,
                type: "success",
            })
            router.push(redirect)
        } catch (err) {
            toast.add({
                title: "Login Failed",
                description: err instanceof Error ? err.message : "Invalid username or password",
                type: "error",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Stock Console</CardTitle>
                <CardDescription>
                    Login to view stock.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-username">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-username"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your username"
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-password">
                                        Password
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="form-rhf-demo-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            disabled={isSubmitting}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <Eye /> : <EyeOff />}
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button className="w-full mt-4" type="submit" form="form-rhf-demo" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export function LoginForm() {
    return (
        <Suspense fallback={<div className="h-72 w-full sm:max-w-md rounded-lg border bg-card animate-pulse" />}>
            <LoginFormContent />
        </Suspense>
    )
}
