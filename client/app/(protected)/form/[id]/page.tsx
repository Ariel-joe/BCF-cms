"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFormSubmissionStore } from "@/stores/formSubmissionStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoadingSkeleton from "@/components/loading-comp";
import { useParams, useRouter } from "next/navigation";
import { get } from "http";

function formatSubject(subject: string): string {
    return subject
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function FormSubmissionDetails() {
    const { submissionData, getSubmissionById, loading } =
        useFormSubmissionStore();
    const [fetchAttempted, setFetchAttempted] = useState(false);

    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            if (stringId && stringId !== "undefined") {
                await getSubmissionById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchProfile();
    }, [stringId, getSubmissionById]);
    // Show loading state
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
                <Link href="/form">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Submissions
                    </Button>
                </Link>
            </div>

            {/* Redesigned Card */}
            <Card className="shadow-xl border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground italic">
                            {formatDate(submissionData.createdAt)}
                        </span>
                    </div>

                    {/* Sender Info */}
                    <h2 className="text-xl font-semibold">
                        {submissionData.FName} {submissionData.LName}
                    </h2>
                    <p className="text-muted-foreground">{submissionData.email}</p>
                    <p className="text-muted-foreground">{submissionData.phone}</p>
                </div>

                {/* Content */}
                <CardContent className="px-8 py-6 space-y-6">
                    {/* Subject */}
                    <div className="pb-4 border-b border-dashed">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest">
                            Subject
                        </p>
                        <p className="text-lg font-semibold">
                            {formatSubject(submissionData.subject)}
                        </p>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
                            Message
                        </p>
                        <div className="bg-slate-50 border p-5 rounded-lg">
                            <p className="whitespace-pre-line leading-relaxed">
                                {submissionData.message}
                            </p>
                        </div>
                    </div>

                    {/* Newsletter */}
                    {submissionData.newsletter && (
                        <div className="pt-4 border-t text-center">
                            <p className="text-sm text-muted-foreground italic">
                                This sender has subscribed to the newsletter
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
