"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    User,
    Mail,
    Lock,
    Shield,
    CheckCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import Link from "next/link";

interface Role {
    _id: string;
    name: string;
}

interface FormData {
    email: string;
    password: string;
    name: string;
    isActive: boolean;
    role: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
}

export function CreateAccountForm() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        name: "",
        isActive: true,
        role: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Simulate fetching roles from server
    useEffect(() => {
        const fetchRoles = async () => {
            setIsLoadingRoles(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Mock roles data from server
            const mockRoles: Role[] = [
                { _id: "1", name: "admin" },
                { _id: "2", name: "editor" },
                { _id: "3", name: "viewer" },
                { _id: "4", name: "moderator" },
            ];
            setRoles(mockRoles);
            setIsLoadingRoles(false);
        };

        fetchRoles();
    }, []);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.role) {
            newErrors.role = "Please select a role";
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
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const accountData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            isActive: formData.isActive,
            role: formData.role,
        };

        console.log("Account Created:", accountData);
        alert("Account created successfully!");
        setIsSubmitting(false);

        // Reset form
        setFormData({
            email: "",
            password: "",
            name: "",
            isActive: true,
            role: "",
        });
    };

    const handleInputChange = (
        field: keyof FormData,
        value: string | boolean
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Account Information
                    </CardTitle>
                    <CardDescription>
                        Enter the details for the new user account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-2"
                        >
                            <User className="h-4 w-4 text-muted-foreground" />
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange("name", e.target.value)
                            }
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="flex items-center gap-2"
                        >
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={(e) =>
                                handleInputChange("email", e.target.value)
                            }
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="password"
                            className="flex items-center gap-2"
                        >
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            Password *
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password (min. 8 characters)"
                                value={formData.password}
                                onChange={(e) =>
                                    handleInputChange(
                                        "password",
                                        e.target.value
                                    )
                                }
                                className={
                                    errors.password
                                        ? "border-red-500 pr-10"
                                        : "pr-10"
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Role Dropdown */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="role"
                            className="flex items-center gap-2"
                        >
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            Role *
                        </Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) =>
                                handleInputChange("role", value)
                            }
                            disabled={isLoadingRoles}
                        >
                            <SelectTrigger
                                id="role"
                                className="rounded-none w-full"
                            >
                                <SelectValue
                                    placeholder={
                                        isLoadingRoles
                                            ? "Loading roles..."
                                            : "Select a role"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem
                                        key={role._id}
                                        value={role.name}
                                    >
                                        <span className="capitalize">
                                            {role.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-red-500">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* isActive Toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="isActive"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                Account Active
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {formData.isActive
                                    ? "Account will be active upon creation"
                                    : "Account will be disabled upon creation"}
                            </p>
                        </div>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                handleInputChange("isActive", checked)
                            }
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4 justify-end">
                        <Link href="/account">
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-transparent"
                            >
                            Cancel
                        </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-btn-view"
                        >
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
