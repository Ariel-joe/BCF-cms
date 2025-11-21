"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authstore";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { login } = useAuthStore();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        submit?: string;
    }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e: typeof errors = {};
        if (!email) {
            e.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.email = "Enter a valid email";
        }

        if (!password) {
            e.password = "Password is required";
        } else if (password.length < 6) {
            e.password = "Password must be at least 6 characters";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleGoogleSignIn = () => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "";
        const url = base.replace(/\/$/, "") + "/auth/google";
        window.location.href = url;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        if (!validate()) return;

        setLoading(true);
        try {
            const data = await login({ email, password });
            setLoading(false);

            // Treat explicit ok:false or returned error(s) as failure; otherwise success
            if (data && data.ok === false) {
                const message =
                    data.error ||
                    (data.errors && data.errors[0]) ||
                    "Login failed";
                setErrors({ submit: message });
                toast.error(message);
            } else if (data && (data.error || data.errors)) {
                const message =
                    data.error ||
                    (data.errors && data.errors[0]) ||
                    "Login failed";
                setErrors({ submit: message });
                toast.error(message);
            } else {
                // Success: reset inputs, show toast and redirect to dashboard
                setEmail("");
                setPassword("");
                setErrors({});
                toast.success("Logged in successfully");
                // small delay to allow the browser to apply Set-Cookie from the response
                await new Promise((resolve) => setTimeout(resolve, 300));
                router.push("/dashboard");
            }
        } catch (err: any) {
            setLoading(false);
            const message = err?.message || "Login failed";
            setErrors({ submit: message });
            toast.error(message);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-xl font-bold">
                            Login to BCF portal.
                        </h1>
                    </div>
                    <Field className="">
                        <Button
                            variant="outline"
                            type="button"
                            className="border-none shadow-none"
                            onClick={handleGoogleSignIn}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="800"
                                height="800"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </Field>
                    <FieldSeparator>Or</FieldSeparator>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="rounded-none py-5"
                            required
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            className="rounded-none py-5"
                            required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <Button
                            type="submit"
                            className="rounded-none bg-button-blue hover:bg-light-blue"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
