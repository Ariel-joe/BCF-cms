"use client";
import LoadingSkeleton from "@/components/loading-comp";
import { useProfileStore } from "@/stores/profileStore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function page() {
    const { getProfileById, profile, loading, deleteProfile } =
        useProfileStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);

    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    const handleDelete = async () => {
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

    useEffect(() => {
        const fetchProfile = async () => {
            if (stringId && stringId !== "undefined") {
                await getProfileById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchProfile();
    }, [stringId, getProfileById]); // Fixed: use stringId instead of id

    // Show loading state
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Show error state if no profile found
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
    return (
        <section id="bio-hero" className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-1">
                        <div className="bg-white text-center sticky top-24">
                            <img
                                src={profile.image}
                                alt={profile.name}
                                className="w-70 h-70 mx-auto"
                            />
                        </div>
                    </div>

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

                            <div>
                                {/* delete button and update button */}
                                <div className="max-w-4xl mx-auto    flex gap-3">
                                    <a
                                        href={`/profile/edit/${
                                            profile.id ?? profile._id
                                        }`}
                                        className="items-center text-center w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                                    >
                                        Update
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete()}
                                        className="text-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 w-full text-white text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
