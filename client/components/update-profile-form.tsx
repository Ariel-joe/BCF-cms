"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { useProfileStore } from "@/stores/profileStore";
import { useParams, useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/loading-comp";

interface ProfileFormData {
    name: string;
    position: string;
    slug: "both" | "team" | "board" | "";
    bio: string;
    image: File | null;
    imagePreview: string | null;
}

export default function EditProfileForm() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const stringId = String(id);

    const {
        getProfileById,
        profile,
        loading: storeLoading,
        updateProfile,
    } = useProfileStore();
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<ProfileFormData>({
        name: "",
        position: "",
        slug: "",
        bio: "",
        image: null,
        imagePreview: null,
    });

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (stringId && stringId !== "undefined") {
                await getProfileById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchProfile();
    }, [stringId, getProfileById]);

    // Populate form when profile data is loaded
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                position: profile.position || "",
                slug: profile.slug || "",
                bio: profile.bio || "",
                image: null,
                imagePreview: profile.image || null,
            });
        }
    }, [profile]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, name: e.target.value });
    };

    const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, position: e.target.value });
    };

    const handleSlugChange = (value: string) => {
        setFormData({
            ...formData,
            slug: value as "both" | "team" | "board",
        });
    };

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, bio: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            toast.warning("Please enter a name");
            return;
        }

        if (!formData.position.trim()) {
            toast.warning("Please enter a position");
            return;
        }

        if (!formData.slug) {
            toast.warning("Please select a type");
            return;
        }

        // Check if we have an image (either existing or new)
        if (!formData.imagePreview && !formData.image) {
            toast.warning("Please upload a profile image");
            return;
        }

        // Build FormData
        const fd = new FormData();
        fd.append("name", formData.name.trim());
        fd.append("position", formData.position.trim());
        fd.append("slug", formData.slug);
        fd.append("bio", formData.bio.trim());

        // Append new image if provided
        if (formData.image) {
            fd.append("image", formData.image);
        }

        setSubmitting(true);
        try {
            const result = await updateProfile(stringId, fd);

            if (result?.ok) {
                toast.success("Profile updated successfully!");
                router.push("/profile");
            } else {
                toast.error(result?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (storeLoading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Profile not found
    if (!storeLoading && fetchAttempted && !profile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Profile not found
                    </h2>
                    <p className="text-neutral-600">
                        The profile you're trying to edit doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
            {/* Profile Image and Basic Information */}
            <Card>
                <CardContent>
                    <div className="flex gap-4 pt-6">
                        {/* Left Column - Image */}
                        <div className="w-full items-center">
                            <Label className="block mb-2">
                                Profile Image *
                            </Label>
                            <div className="w-full mx-auto">
                                <ImageUpload
                                    onImageChange={(file, preview) => {
                                        setFormData({
                                            ...formData,
                                            image: file,
                                            imagePreview: preview,
                                        });
                                    }}
                                    preview={formData.imagePreview}
                                />
                            </div>
                            {formData.imagePreview && !formData.image && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Currently using existing image. Upload a new
                                    one to replace it.
                                </p>
                            )}
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-4 w-full">
                            <div>
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="position">Position *</Label>
                                <Input
                                    id="position"
                                    placeholder="Enter position"
                                    value={formData.position}
                                    onChange={handlePositionChange}
                                    className="mt-2"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="slug">Type *</Label>
                                <Select
                                    value={formData.slug}
                                    onValueChange={handleSlugChange}
                                >
                                    <SelectTrigger
                                        id="slug"
                                        className="mt-2 w-full rounded-none"
                                    >
                                        <SelectValue placeholder="Select profile type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="both">
                                            Both (Team & Board)
                                        </SelectItem>
                                        <SelectItem value="team">
                                            Team Only
                                        </SelectItem>
                                        <SelectItem value="board">
                                            Board Only
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bio - Full Width */}
            <Card>
                <CardHeader>
                    <CardTitle>Bio</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        id="bio"
                        placeholder="Enter bio information..."
                        value={formData.bio}
                        onChange={handleBioChange}
                        rows={5}
                        className="rounded-none"
                    />
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="px-8 bg-button-blue hover:bg-light-blue"
                    disabled={submitting}
                >
                    {submitting ? "Updating..." : "Update Profile"}
                </Button>
            </div>
        </form>
    );
}
