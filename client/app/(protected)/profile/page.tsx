"use client";

import React, { useEffect } from "react";
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
            <div className="container max-w-5xl mx-auto px-6 mt-6">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                Team & Board Members Profiles
                            </h1>
                        </div>
                        <div className="text-sm text-gray-500">
                            <span>
                                Showing {profilesData.length}{" "}
                                {profilesData.length === 1 ? "profile" : "profiles"}
                            </span>
                        </div>
                    </div>
                </header>
                <div className="">
                    <Table className="mx-auto max-w-5xl">
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
                                    Slug
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
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                                            <img
                                                src={profile.image}
                                                alt="profile image"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {/* {profile.name
                                                .split(" ")
                                                .map((word: string) =>
                                                    word.charAt(0)
                                                )
                                                .join("")} */}
                                        </div>
                                    </TableCell>
                                    <TableCell>{profile.name}</TableCell>
                                    <TableCell>{profile.position}</TableCell>
                                    <TableCell>
                                        {profile.slug === "team"
                                            ? "Team Only"
                                            : profile.slug === "board"
                                            ? "Board Only"
                                            : "Both Team & Board"}
                                    </TableCell>
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
