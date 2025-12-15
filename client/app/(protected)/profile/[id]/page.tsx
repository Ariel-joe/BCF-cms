"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import LoadingSkeleton from "@/components/loading-comp";
import { useProfileStore } from "@/stores/profileStore";
import { useAuthStore } from "@/stores/authstore";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const stringId = String(params?.id);

    /* =========================
       STORES
    ========================== */
    const { getProfileById, profile, loading, deleteProfile } =
        useProfileStore();

    const { user } = useAuthStore();

    /* =========================
       LOCAL STATE
    ========================== */
    const [fetchAttempted, setFetchAttempted] = useState(false);

    /* =========================
       PERMISSIONS
       (loaded at login)
    ========================== */
    const permissions: string[] = user?.permissions || [];

    const canUpdateProfile = permissions.includes("update_profile");
    const canDeleteProfile = permissions.includes("delete_profile");

    /* =========================
       FETCH PROFILE
    ========================== */
    useEffect(() => {
        const fetchProfile = async () => {
            if (stringId && stringId !== "undefined") {
                await getProfileById(stringId);
                setFetchAttempted(true);
            }
        };

        fetchProfile();
    }, [stringId, getProfileById]);

    /* =========================
       DELETE HANDLER
    ========================== */
    const handleDelete = async () => {
        if (!canDeleteProfile) {
            toast.error("You are not allowed to delete this profile");
            return;
        }

        if (profile && (profile.id || profile._id)) {
            const deleted = await deleteProfile(profile.id ?? profile._id);

            if (deleted) {
                toast.success("Profile deleted successfully");
                router.push("/profile");
            } else {
                toast.error("Failed to delete profile");
            }
        }
    };

    /* =========================
       LOADING STATE
    ========================== */
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    /* =========================
       NOT FOUND STATE
    ========================== */
    if (!loading && fetchAttempted && !profile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Profile not found
                    </h2>
                    <p className="text-neutral-600">
                        The profile you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    /* =========================
       MAIN VIEW
    ========================== */
    return (
        <section id="bio-hero" className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* IMAGE */}
                    <div className="lg:col-span-1">
                        <div className="bg-white text-center sticky top-24">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-70 h-70 mx-auto"
                            />
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="lg:col-span-2">
                        <div className="prose prose-lg max-w-none">
                            <h1 className="text-3xl text-light-blue font-bold mb-2">
                                {profile.name}
                            </h1>

                            <p className="text-lg text-neutral-600 font-semibold mb-4">
                                {profile.position}
                            </p>

                            <p className="text-lg text-neutral-500 mb-8 px-3 text-justify leading-relaxed">
                                {profile.bio}
                            </p>

                            {/* ACTION BUTTONS */}
                            {(canUpdateProfile || canDeleteProfile) && (
                                <div className="max-w-4xl mx-auto flex gap-3">
                                    {canUpdateProfile && (
                                        <Link
                                            href={`/profile/edit/${
                                                profile.id ?? profile._id
                                            }`}
                                            className="items-center text-center w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                                        >
                                            Update
                                        </Link>
                                    )}

                                    {canDeleteProfile && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="text-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 w-full text-white text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
