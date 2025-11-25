"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { useRouter } from "next/navigation";

interface ProfileFormData {
    name: string;
    position: string;
    slug: "both" | "team" | "board" | "";
    bio: string;
    image: File | null;
    imagePreview: string | null;
}

export function ProfileForm() {
    const { loading, createProfile } = useProfileStore();
    const router = useRouter()

    const [formData, setFormData] = useState<ProfileFormData>({
        name: "",
        position: "",
        slug: "",
        bio: "",
        image: null,
        imagePreview: null,
    });

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

        if (!formData.image) {
            toast.warning("Please upload a profile image");
            return;
        }

        // Build FormData
        const fd = new FormData();
        fd.append("name", formData.name.trim());
        fd.append("position", formData.position.trim());
        fd.append("slug", formData.slug);
        fd.append("bio", formData.bio.trim());
        fd.append("image", formData.image);

        const result = await createProfile(fd);

        if (result && result.ok) {
            toast.success("Profile created successfully!");
            router.push('/profile');
            // Reset form
            setFormData({
                name: "",
                position: "",
                slug: "",
                bio: "",
                image: null,
                imagePreview: null,
            });
        } else {
            toast.error(result?.message || "Failed to create profile");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
            {/* Profile Image and Basic Information */}
            <Card>
                <CardContent>
                    <div className="flex gap-4">
                        {/* Left Column - Image */}
                        <div className="w-full items-center">
                            <Label className="block mb-2">
                                Profile Image *
                            </Label>
                            <div className="w-2/3 h-2/3">
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
                        className="resize-none"
                    />
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end">
                <Button
                    type="submit"
                    className="px-8 bg-button-blue hover:bg-light-blue"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Profile"}
                </Button>
            </div>
        </form>
    );
}
