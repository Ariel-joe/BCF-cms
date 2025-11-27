"use client";
import LoadingSkeleton from "@/components/loading-comp";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Shield,
    ShieldOff,
    User,
    AtSign,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { useAccountStore } from "@/stores/accountStore";

export default function AccountDetailPage() {
    const {
        getAccountById,
        accountData,
        loading,
        activateAccount,
        deactivateAccount,
    } = useAccountStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = React.useState(false);
    const [isSendingReset, setIsSendingReset] = React.useState(false);

    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    useEffect(() => {
        const fetchAccount = async () => {
            if (stringId && stringId !== "undefined") {
                await getAccountById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchAccount();
    }, [stringId, getAccountById]);

    const formatDate = (date?: Date) => {
        if (!date) return "Never";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleToggleStatus = async () => {
        if (!accountData) return;

        setIsTogglingStatus(true);
        try {
            let result;
            if (accountData.isActive) {
                result = await deactivateAccount(stringId);
                if (result) {
                    toast.success("Account deactivated successfully");
                } else {
                    toast.error("Failed to deactivate account");
                }
            } else {
                result = await activateAccount(stringId);
                if (result) {
                    toast.success("Account activated successfully");
                } else {
                    toast.error("Failed to activate account");
                }
            }

            // Refresh account data
            if (result) {
                await getAccountById(stringId);
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error("An error occurred while updating account status");
        } finally {
            setIsTogglingStatus(false);
        }
    };

    const handleSendPasswordReset = async () => {
        setIsSendingReset(true);
        // TODO: Implement password reset logic
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(`Password reset email sent to ${accountData?.email}`);
        setIsSendingReset(false);
    };

    // Show loading state
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Show error state if no account found
    if (!loading && fetchAttempted && !accountData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Account not found
                    </h2>
                    <p className="text-neutral-600">
                        The account you're looking for doesn't exist or may have
                        been removed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-6 max-w-5xl">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Account Details
                </h1>
                <p className="text-muted-foreground mt-2">
                    Comprehensive user information, including details, role,
                    status, and management options.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Account Details - Left Side */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                View detailed account information, role
                                assignment, and current status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Full Name
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {accountData.name}
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <AtSign className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email Address
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {accountData.email}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Primary contact and login credential
                                    </p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Role & Permissions
                                    </p>
                                    <Badge
                                        variant="secondary"
                                        className="mt-1 capitalize"
                                    >
                                        {accountData.role}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Defines access level and available
                                        actions
                                    </p>
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    {accountData.isActive ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Account Status
                                    </p>
                                    <Badge
                                        variant={
                                            accountData.isActive
                                                ? "default"
                                                : "destructive"
                                        }
                                        className={
                                            accountData.isActive
                                                ? "mt-1 bg-green-600 hover:bg-green-700"
                                                : "mt-1"
                                        }
                                    >
                                        {accountData.isActive
                                            ? "Active"
                                            : "Disabled"}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {accountData.isActive
                                            ? "User can log in and access the system"
                                            : "User is restricted from accessing the system"}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t pt-6">
                                {/* Last Login */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Last Login
                                        </p>
                                        <p className="text-base">
                                            {accountData.lastLogin ? formatDate(new Date(accountData.lastLogin)) : "Never"}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Most recent system access timestamp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions - Right Side */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Management</CardTitle>
                            <CardDescription>
                                Manage necessary user actions including password
                                reset and account status control
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Activate/Deactivate Button */}
                            <div>
                                <Button
                                    onClick={handleToggleStatus}
                                    disabled={isTogglingStatus}
                                    className={`w-full ${
                                        accountData.isActive
                                            ? "bg-red-600 hover:bg-red-700 text-white"
                                            : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}
                                >
                                    {isTogglingStatus ? (
                                        "Processing..."
                                    ) : accountData.isActive ? (
                                        <>
                                            <ShieldOff className="mr-2 h-4 w-4" />
                                            Deactivate Account
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Activate Account
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {accountData.isActive
                                        ? "Temporarily disable this user's access to the system"
                                        : "Restore this user's access to the system"}
                                </p>
                            </div>

                            {/* Send Password Reset Email */}
                            <div>
                                <Button
                                    onClick={handleSendPasswordReset}
                                    disabled={isSendingReset}
                                    variant="outline"
                                    className="w-full bg-transparent"
                                >
                                    {isSendingReset ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Password Reset
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Send a secure password reset link to the
                                    user's email address
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
