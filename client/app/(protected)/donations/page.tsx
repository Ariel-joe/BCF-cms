"use client";
import React, { useEffect, useState } from "react";
import { ChartBarInteractive } from "@/components/bar-chart";
import { ChartPieLabelList } from "@/components/piechart";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import LoadingSkeleton from "@/components/loading-comp";

export default function DashboardPage() {
    const [donations, setDonations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMethod, setFilterMethod] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/donations`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (data.success) {
                setDonations(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter donations
    const filteredDonations = donations.filter((donation: any) => {
        const matchesSearch =
            searchQuery === "" ||
            donation.fullName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            donation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            donation.reference
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesMethod =
            filterMethod === "all" || donation.method === filterMethod;

        return matchesSearch && matchesMethod;
    });

    // Format amount
    const formatAmount = (amount: number) => {
        return `KES ${(amount / 100).toLocaleString()}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Donations Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                    Overview of donation analytics and transaction history
                </p>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartBarInteractive donations={donations} />
                </div>
                <div>
                    <ChartPieLabelList donations={donations} />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="mt-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                        Transaction History
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        View and search all donation transactions
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search by name, email, or reference..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select
                        value={filterMethod}
                        onValueChange={setFilterMethod}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Methods</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="mobile_money">
                                Mobile Money
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="overflow-hidden">
                    <Table>
                        <TableCaption>
                            Showing {filteredDonations.length} of{" "}
                            {donations.length} transactions
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-[#008b07] to-[#0b5c11]">
                                <TableHead className="text-white"></TableHead>
                                <TableHead className="text-white">
                                    Donor Name
                                </TableHead>
                                <TableHead className="text-white">
                                    Email
                                </TableHead>
                                <TableHead className="text-white">
                                    Amount
                                </TableHead>
                                <TableHead className="text-white">
                                    Method
                                </TableHead>
                                <TableHead className="text-white">
                                    Reference
                                </TableHead>
                                <TableHead className="text-white">
                                    Date
                                </TableHead>
                                <TableHead className="text-white">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDonations.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        {searchQuery || filterMethod !== "all"
                                            ? "No transactions match your search or filter"
                                            : "No transactions found"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDonations.map(
                                    (donation: any, index: number) => (
                                        <TableRow
                                            key={donation.reference}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                {donation.fullName}
                                            </TableCell>
                                            <TableCell>
                                                {donation.email}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatAmount(donation.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {donation.method.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {donation.reference}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(donation.paidAt)}
                                            </TableCell>
                                            <TableCell className="text-xs text-green-700 font-bold">
                                                {donation.status}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
