"use client";

import React, { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useProfileStore } from "@/stores/profileStore";
import LoadingSkeleton from "./loading-comp";
import Link from "next/link";

export default function ProfileTable() {
    const { loading, fetchProfiles, profilesData } = useProfileStore();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    useEffect(() => {
        fetchProfiles();
    }, []);

    return (
        <Table className="mx-auto max-w-6xl">
            <TableCaption>
                A list of profiles (both Team and Board members).
            </TableCaption>
            <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#152bff] via-[#081bee] to-[#15269a]">
                    <TableHead className="text-white">#</TableHead>
                    <TableHead className="text-white">Photo</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Position</TableHead>
                    <TableHead className="text-white">Bio</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profilesData.map((profile: any, index: number) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                            <span className="rounded-full bg-neutral-400 p-1.5">
                                {profile.name
                                    .split(" ")
                                    .map((word: string) => word.charAt(0))
                                    .join("")}
                            </span>
                        </TableCell>
                        <TableCell>{profile.name}</TableCell>
                        <TableCell>{profile.position}</TableCell>
                        <TableCell>
                            <Link
                                href={`/profile/${profile._id}`}
                                className="text-light-blue underline cursor-pointer"
                            >
                                View
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
