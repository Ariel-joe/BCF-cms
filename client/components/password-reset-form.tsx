"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, KeyRound, Check, X } from "lucide-react";
import { useAuthStore } from "@/stores/authstore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormData {
    newPassword: string;
    confirmPassword: string;
}

interface FormErrors {
    newPassword?: string;
    confirmPassword?: string;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

interface PasswordResetFormProps {
    token: string;
}

export function PasswordResetForm({ token }: PasswordResetFormProps) {
    const [formData, setFormData] = useState<FormData>({
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { resetPassword } = useAuthStore();
    const router = useRouter()

    // Password requirements
    const passwordRequirements = useMemo(() => {
        const password = formData.newPassword;
        return [
            { label: "At least 8 characters", met: password.length >= 8 },
            {
                label: "One uppercase letter (A-Z)",
                met: /[A-Z]/.test(password),
            },
            {
                label: "One lowercase letter (a-z)",
                met: /[a-z]/.test(password),
            },
            { label: "One number (0-9)", met: /[0-9]/.test(password) },
            {
                label: "One special character (!@#$%^&*)",
                met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            },
        ];
    }, [formData.newPassword]);

    // Calculate password strength
    const passwordStrength: PasswordStrength = useMemo(() => {
        const metCount = passwordRequirements.filter((req) => req.met).length;
        const score = (metCount / passwordRequirements.length) * 100;

        if (score < 50) {
            return { score, label: "Weak", color: "bg-red-500" };
        } else if (score < 100) {
            return { score, label: "Medium", color: "bg-orange-500" };
        } else {
            return { score, label: "Strong", color: "bg-green-500" };
        }
    }, [passwordRequirements]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "New password is required";
        } else if (passwordStrength.score < 100) {
            newErrors.newPassword = "Please meet all password requirements";
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        const result = await resetPassword(token, formData.newPassword);

        if (result) {
            toast.success("Password reset successfully!");
            router.push("/login");
        } else {
            toast.error("Failed to reset password");
        }

        setIsSubmitting(false);

        // Reset form
        setFormData({
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-extrabold">Reset Password</CardTitle>
                    <CardDescription>
                        Create a new secure password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="newPassword"
                            className="flex items-center gap-2 font-semibold"
                        >
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={(e) =>
                                    handleInputChange(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                                className={
                                    errors.newPassword
                                        ? "border-red-500 pr-10"
                                        : "pr-10"
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">
                                {errors.newPassword}
                            </p>
                        )}

                        {/* Password Strength Bar */}
                        {formData.newPassword && (
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Password Strength
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            passwordStrength.score < 50
                                                ? "text-red-500"
                                                : passwordStrength.score < 100
                                                ? "text-orange-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{
                                            width: `${passwordStrength.score}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Requirements */}
                        <div className="rounded-lg border bg-muted/30 p-3 mt-3">
                            <p className="text-sm font-medium mb-2 text-muted-foreground">
                                Strong password requirements:
                            </p>
                            <ul className="space-y-1">
                                {passwordRequirements.map((req, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        {req.met ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span
                                            className={
                                                req.met
                                                    ? "text-green-600"
                                                    : "text-muted-foreground"
                                            }
                                        >
                                            {req.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="flex items-center gap-2 font-semibold"
                        >
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    handleInputChange(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                                className={
                                    errors.confirmPassword
                                        ? "border-red-500 pr-10"
                                        : "pr-10"
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                        {formData.confirmPassword &&
                            formData.newPassword === formData.confirmPassword &&
                            !errors.confirmPassword && (
                                <p className="text-sm text-green-500 flex items-center gap-1">
                                    <Check className="h-4 w-4" /> Passwords
                                    match
                                </p>
                            )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
