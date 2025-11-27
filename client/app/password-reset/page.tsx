"use client";

import { useSearchParams } from "next/navigation";
import { PasswordResetForm } from "@/components/password-reset-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/loading-comp";

function PasswordResetContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    if (!token) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle>Invalid Reset Link</CardTitle>
                    <CardDescription>
                        This password reset link is invalid or has expired.
                        Please request a new password reset email.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return <PasswordResetForm token={token} />;
}

export default function PasswordResetPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Suspense
                    fallback={<LoadingSkeleton />}
                >
                    <PasswordResetContent />
                </Suspense>
            </div>
        </div>
    );
}
