"use client";

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
import { Button } from "@/components/ui/button";
import { useAccountStore } from "@/stores/accountStore";
import { useAuthStore } from "@/stores/authstore";
import { useEffect, useState } from "react";
import LoadingSkeleton from "@/components/loading-comp";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
    const { accounts, fetchAccounts, loading } = useAccountStore();
    const { user } = useAuthStore();
    const router = useRouter();

    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const permissions = user?.permissions || [];

    // Only users with all three permissions can view single account details
    const canViewSingleAccount =
        permissions.includes("user:read") &&
        permissions.includes("user:update") &&
        permissions.includes("user:delete");

    useEffect(() => {
        fetchAccounts();
        setFetchAttempted(true);
    }, []);

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAccounts();
        setRefreshing(false);
    };

    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <main className="container max-w-6xl mx-auto px-6 mt-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            User Accounts
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Manage and view all registered user accounts
                        </p>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        variant="outline"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${
                                refreshing ? "animate-spin" : ""
                            }`}
                        />
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </Button>
                </div>

                <div className="overflow-hidden">
                    <Table>
                        <TableCaption>
                            A list of all registered user accounts.
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-[#152bff] via-[#081bee] to-[#15269a]">
                                <TableHead className="text-white">#</TableHead>
                                <TableHead className="text-white">Name</TableHead>
                                <TableHead className="text-white">Email</TableHead>
                                <TableHead className="text-white">Role</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="text-white">Last Login</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {refreshing ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64">
                                        <div className="flex items-center justify-center">
                                            <LoadingSkeleton />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : accounts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No accounts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                accounts.map((userItem: any, index: number) => (
                                    <TableRow
                                        key={index}
                                        className={
                                            canViewSingleAccount
                                                ? "cursor-pointer hover:bg-gray-100"
                                                : ""
                                        }
                                        onClick={() => {
                                            if (canViewSingleAccount) {
                                                router.push(`/account/${userItem.id}`);
                                            }
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{userItem.name}</TableCell>
                                        <TableCell>{userItem.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={"outline"} className="capitalize">
                                                {userItem.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={userItem.isActive ? "default" : "destructive"}
                                                className={userItem.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                                            >
                                                {userItem.isActive ? "Active" : "Disabled"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {userItem.lastLogin
                                                ? new Date(userItem.lastLogin).toLocaleString()
                                                : "Never"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </main>
    );
}
