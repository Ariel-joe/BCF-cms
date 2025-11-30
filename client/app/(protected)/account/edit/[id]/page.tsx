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
import { User, Mail, Shield, CheckCircle } from "lucide-react";
import { useRoleStore } from "@/stores/roleStore";
import { toast } from "sonner";
import { useAccountStore } from "@/stores/accountStore";
import { useRouter, useParams } from "next/navigation";
import LoadingSkeleton from "@/components/loading-comp";

interface Role {
    id: string;
    name: string;
    slug: string;
}

interface FormData {
    email: string;
    name: string;
    isActive: boolean;
    role: string;
}

interface FormErrors {
    email?: string;
    name?: string;
    role?: string;
}

export default function EditAccountForm() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const stringId = String(id);

    const [formData, setFormData] = useState<FormData>({
        email: "",
        name: "",
        isActive: true,
        role: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetchAttempted, setFetchAttempted] = useState(false);

    const { loading: rolesLoading, fetchRoles, roles } = useRoleStore();
    const {
        getAccountById,
        accountData,
        loading: accountLoading,
        updateAccountDetails,
    } = useAccountStore();

    // Fetch roles
    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    // Fetch account data
    useEffect(() => {
        const fetchAccount = async () => {
            if (stringId && stringId !== "undefined") {
                await getAccountById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchAccount();
    }, [stringId, getAccountById]);

    // Populate form when account data is loaded
    useEffect(() => {
        if (accountData && roles.length > 0) {
            // Find the role object that matches the account's role slug
            const matchingRole = roles.find(
                (role: Role) => role.slug === accountData.role
            );

            setFormData({
                email: accountData.email || "",
                name: accountData.name || "",
                isActive: accountData.isActive ?? true,
                role: matchingRole ? matchingRole.id : "",
            });
        }
    }, [accountData, roles]);

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

        const accountDetails = {
            name: formData.name,
            email: formData.email,
            isActive: formData.isActive,
            role: formData.role,
        };

        const result = await updateAccountDetails(stringId, accountDetails);

        if (result?.ok) {
            toast.success("Account updated successfully!");
            router.push(`/account/${stringId}`);
        } else {
            toast.error("Failed to update account.");
        }

        setIsSubmitting(false);
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

    // Loading state
    if (accountLoading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Account not found
    if (!accountLoading && fetchAttempted && !accountData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Account not found
                    </h2>
                    <p className="text-neutral-600">
                        The account you're trying to edit doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-6 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Edit Account
                </h1>
                <p className="text-muted-foreground mt-2">
                    Update account details, role assignment, and status
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Update the details for this user account
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
                                disabled={rolesLoading}
                            >
                                <SelectTrigger
                                    id="role"
                                    className="rounded-none w-full"
                                >
                                    <SelectValue
                                        placeholder={
                                            rolesLoading
                                                ? "Loading roles..."
                                                : "Select a role"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role: Role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.id}
                                        >
                                            <span className="capitalize">
                                                {role.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                        ? "Account is currently active"
                                        : "Account is currently disabled"}
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

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-transparent"
                                onClick={() =>
                                    router.push(`/account/${stringId}`)
                                }
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-button-blue hover:bg-light-blue"
                            >
                                {isSubmitting
                                    ? "Updating..."
                                    : "Update Account"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
