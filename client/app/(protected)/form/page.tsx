"use client";

import React, { useEffect, useState } from "react";
import { useFormSubmissionStore } from "@/stores/formSubmissionStore";
import LoadingSkeleton from "@/components/loading-comp";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function FormSubmissionsPage() {
    const { submissions, getSubmissions, loading } = useFormSubmissionStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const router = useRouter();

    useEffect(() => {
        getSubmissions();
        setFetchAttempted(true);
    }, [getSubmissions]);

    // Format date with today/yesterday logic
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time to compare only dates
        const dateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        const yesterdayOnly = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate()
        );

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return "Today";
        } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        }
    };

    // Filter submissions based on search and category
    const filteredSubmissions = submissions.filter((submission: any) => {
        // Search filter
        const matchesSearch =
            searchQuery === "" ||
            submission.FName.toLowerCase().includes(
                searchQuery.toLowerCase()
            ) ||
            submission.LName.toLowerCase().includes(
                searchQuery.toLowerCase()
            ) ||
            submission.email
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            submission.subject
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            submission.message
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
            filterCategory === "all" ||
            submission.subject.toLowerCase() === filterCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto px-6 mt-6">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Contact Form Submissions
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            View and manage all contact form messages
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        <span>
                            Showing {filteredSubmissions.length} of{" "}
                            {submissions.length}{" "}
                            {submissions.length === 1 ? "message" : "messages"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search by name, email, subject, or message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Category Filter */}
                <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                >
                    <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="general inquiry">
                            General Inquiry
                        </SelectItem>
                        <SelectItem value="volunteer opportunities">
                            Volunteer Opportunities
                        </SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="media inquiry">
                            Media Inquiry
                        </SelectItem>
                        <SelectItem value="donation question">
                            Donation Question
                        </SelectItem>
                        <SelectItem value="internship opportunities">
                            Internship Opportunities
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-[#fd6c12] via-[#ee5108] to-[#c53b09]">
                            <TableHead className="text-white"></TableHead>
                            <TableHead className="text-white">Name</TableHead>

                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">
                                Subject
                            </TableHead>
                            <TableHead className="text-white">
                                Message
                            </TableHead>
                            <TableHead className="text-white">
                                Date Submitted
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubmissions.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-8 text-gray-500"
                                >
                                    {searchQuery || filterCategory !== "all"
                                        ? "No submissions match your search or filter"
                                        : "No submissions found"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubmissions.map(
                                (submission: any, index: number) => (
                                    <TableRow
                                        key={submission._id || index}
                                        onClick={() =>
                                            router.push(
                                                `/form/${submission._id}`
                                            )
                                        }
                                        className="hover:cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <TableCell className="font-medium">
                                            {submission.isRead ? (
                                                ""
                                            ) : (
                                                <span className="w-2 h-2 rounded-full font-bold text-blue-500 p-0.5 text-xs">
                                                    unread
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {submission.FName}{" "}
                                            {submission.LName}
                                        </TableCell>
                                        <TableCell>
                                            {submission.email}
                                        </TableCell>
                                        <TableCell className="capitalize font-semibold">
                                            {submission.subject}
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            {submission.message.length > 30
                                                ? submission.message.substring(
                                                      0,
                                                      47
                                                  ) + "..."
                                                : submission.message}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {formatDate(submission.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
