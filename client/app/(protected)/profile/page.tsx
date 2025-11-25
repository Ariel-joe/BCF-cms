"use client";

import ProfileTable from "@/components/profile-table";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { ProfileForm } from "@/components/profile-form";
import LoadingSkeleton from "@/components/loading-comp";
import { useProfileStore } from "@/stores/profileStore";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type ProfileSlug = "both" | "team" | "board";

interface ProfileData {
    name: string;
    position: string;
    slug: ProfileSlug;
    image: string | null;
    bio?: string;
}

const profile: ProfileData = {
    name: "",
    position: "",
    slug: "team",
    image: null,
    bio: "",
};

export default function page() {
    // loading userprofiles to the table
    const { loading, fetchProfiles, profilesData } = useProfileStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);


    useEffect(() => {
        fetchProfiles();
        setFetchAttempted(true);
    }, []);

    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <>
            <div className="container max-w-6xl mx-auto px-6 mt-6">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                User Profiles
                            </h1>
                        </div>
                        <div className="text-sm text-gray-500">
                            <span>
                                {/* Showing {blogs.length}{" "}
                                {blogs.length === 1 ? "post" : "posts"} */}
                            </span>
                        </div>
                    </div>
                </header>
                <div className="">
                    <Table className="mx-auto max-w-6xl">
                        <TableCaption>
                            A list of profiles (both Team and Board members).
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-[#152bff] via-[#081bee] to-[#15269a]">
                                <TableHead className="text-white">#</TableHead>
                                <TableHead className="text-white">
                                    Photo
                                </TableHead>
                                <TableHead className="text-white">
                                    Name
                                </TableHead>
                                <TableHead className="text-white">
                                    Position
                                </TableHead>
                                <TableHead className="text-white">
                                    Bio
                                </TableHead>
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
                                                .map((word: string) =>
                                                    word.charAt(0)
                                                )
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
                </div>
            </div>
        </>
    );
}
