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
import { ContentBlockForm } from "@/components/content-block-form";
import { Plus, Trash2, X } from "lucide-react";
import { useWelfareStore } from "@/stores/welfareStore";
import { toast } from "sonner";

interface ContentBlock {
    id: string;
    subtitle: string;
    paragraphs: string[];
}

interface WelfareFormData {
    title: string;
    summary: string;
    image: File | null;
    imagePreview: string | null;
    category: "internal" | "friends-of-beacon" | "";
    status: "active" | "completed";
    startDate: string;
    partners: string[];
    partnersInput: string;
    content: ContentBlock[];
}

export function WelfareForm() {
    const { loading, createWelfarePost } = useWelfareStore();
    const [formData, setFormData] = useState<WelfareFormData>({
        title: "",
        summary: "",
        image: null,
        imagePreview: null,
        category: "",
        status: "active",
        startDate: "",
        partners: [],
        partnersInput: "",
        content: [
            {
                id: "1",
                subtitle: "",
                paragraphs: [""],
            },
        ],
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, title: e.target.value });
    };

    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, summary: e.target.value });
    };

    const handleCategoryChange = (value: string) => {
        setFormData({
            ...formData,
            category: value as "internal" | "friends-of-beacon",
        });
    };

    const handleStatusChange = (value: string) => {
        setFormData({ ...formData, status: value as "active" | "completed" });
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, startDate: e.target.value });
    };

    const handleAddPartner = () => {
        if (formData.partnersInput.trim()) {
            setFormData({
                ...formData,
                partners: [...formData.partners, formData.partnersInput.trim()],
                partnersInput: "",
            });
        }
    };

    const handleRemovePartner = (index: number) => {
        setFormData({
            ...formData,
            partners: formData.partners.filter((_, i) => i !== index),
        });
    };

    const handlePartnersInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, partnersInput: e.target.value });
    };

    const handleAddContentBlock = () => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            subtitle: "",
            paragraphs: [""],
        };
        setFormData({
            ...formData,
            content: [...formData.content, newBlock],
        });
    };

    const handleRemoveContentBlock = (id: string) => {
        if (formData.content.length > 1) {
            setFormData({
                ...formData,
                content: formData.content.filter((block) => block.id !== id),
            });
        }
    };

    const handleUpdateContentBlock = (
        id: string,
        updatedBlock: ContentBlock
    ) => {
        setFormData({
            ...formData,
            content: formData.content.map((block) =>
                block.id === id ? updatedBlock : block
            ),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.title.trim()) {
            toast.warning("Please enter a title");
            return;
        }

        if (!formData.summary.trim()) {
            toast.warning("Please enter a summary");
            return;
        }

        if (!formData.image) {
            toast.warning("Please upload an image");
            return;
        }

        if (!formData.category) {
            toast.warning("Please select a category");
            return;
        }

        if (!formData.startDate) {
            toast.warning("Please select a start date");
            return;
        }

        if (formData.partners.length === 0) {
            toast.warning("Please add at least one partner");
            return;
        }

        const hasValidContent = formData.content.some(
            (block) =>
                block.subtitle.trim() && block.paragraphs.some((p) => p.trim())
        );

        if (!hasValidContent) {
            toast.warning(
                "Please add at least one content section with a subtitle and paragraph"
            );
            return;
        }

        // ✅ Build FormData (NOT plain object)
        const fd = new FormData();
        fd.append("title", formData.title.trim());
        fd.append("summary", formData.summary.trim());
        fd.append("category", formData.category);
        fd.append("status", formData.status);
        fd.append("startDate", formData.startDate);

        // Append image file
        if (formData.image) {
            fd.append("image", formData.image);
        }

        // Append partners as array
        formData.partners.forEach((partner) => {
            fd.append("partners[]", partner);
        });

        // Clean and append content
        const contentArray = formData.content
            .map((block) => ({
                subtitle: block.subtitle.trim(),
                paragraphs: block.paragraphs
                    .map((p) => p.trim())
                    .filter(Boolean),
            }))
            .filter((block) => block.subtitle && block.paragraphs.length > 0);

        fd.append("content", JSON.stringify(contentArray));

        // ✅ Call the store function with FormData
        const result = await createWelfarePost(fd);

        if (result && result.ok) {
            toast.success("Welfare initiative created successfully!");
            // Reset form or redirect
            setFormData({
                title: "",
                summary: "",
                image: null,
                imagePreview: null,
                category: "",
                status: "active",
                startDate: "",
                partners: [],
                partnersInput: "",
                content: [
                    {
                        id: "1",
                        subtitle: "",
                        paragraphs: [""],
                    },
                ],
            });
        } else {
            toast.error("Failed to create welfare initiative");
        }
    };

    const getTotalParagraphs = () => {
        return formData.content.reduce(
            (sum, block) => sum + block.paragraphs.length,
            0
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>
                        Upload an image for your welfare initiative
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Enter the title and summary of your welfare initiative
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Enter welfare initiative title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="summary">Summary *</Label>
                        <Textarea
                            id="summary"
                            placeholder="Write a brief summary of the welfare initiative"
                            value={formData.summary}
                            onChange={handleSummaryChange}
                            rows={4}
                            className="mt-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Category and Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                    <CardDescription>
                        Select the category and status of your initiative
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger id="category" className="mt-2">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">
                                        Internal
                                    </SelectItem>
                                    <SelectItem value="friends-of-beacon">
                                        Friends of Beacon
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={formData.status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger id="status" className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="startDate">Start Date *</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleStartDateChange}
                            className="mt-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Partners */}
            <Card>
                <CardHeader>
                    <CardTitle>Partners</CardTitle>
                    <CardDescription>
                        Add partners involved in this welfare initiative
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter partner name"
                            value={formData.partnersInput}
                            onChange={handlePartnersInputChange}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddPartner();
                                }
                            }}
                        />
                        <Button
                            type="button"
                            onClick={handleAddPartner}
                            variant="outline"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {formData.partners.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-light-blue text-primary px-3 py-1 rounded-full text-sm"
                                >
                                    {partner}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemovePartner(index)
                                        }
                                        className="hover:text-primary/70"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Content Sections */}
            <Card>
                <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>
                        Add sections with subtitles and paragraphs. You have{" "}
                        {formData.content.length} section
                        {formData.content.length !== 1 ? "s" : ""} and{" "}
                        {getTotalParagraphs()} paragraph
                        {getTotalParagraphs() !== 1 ? "s" : ""}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.content.map((block, index) => (
                        <div key={block.id} className="relative">
                            <ContentBlockForm
                                block={block}
                                onUpdate={(updatedBlock) =>
                                    handleUpdateContentBlock(
                                        block.id,
                                        updatedBlock
                                    )
                                }
                                blockNumber={index + 1}
                            />
                            {formData.content.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleRemoveContentBlock(block.id)
                                    }
                                    className="mt-3 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove Section
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        type="button"
                        onClick={handleAddContentBlock}
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Content Section
                    </Button>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline">
                    Save as Draft
                </Button>
                <Button type="submit" className="px-8 bg-button-blue">
                    Publish Initiative
                </Button>
            </div>
        </form>
    );
}
