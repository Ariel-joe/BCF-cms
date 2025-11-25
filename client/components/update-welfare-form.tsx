"use client";
import { useWelfareStore } from "@/stores/welfareStore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import LoadingSkeleton from "@/components/loading-comp";

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
    budget: string;
    successRate: string;
    impactRecord: {
        individuals: string;
        communities: string;
    };
    progress: string;
    partners: string[];
    partnersInput: string;
    content: ContentBlock[];
}

export default function EditWelfareForm() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const stringId = String(id);

    const {
        fetchWelfareById,
        welfareData,
        loading: storeLoading,
        editWelfare,
    } = useWelfareStore();
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<WelfareFormData>({
        title: "",
        summary: "",
        image: null,
        imagePreview: null,
        category: "",
        status: "active",
        startDate: "",
        budget: "",
        successRate: "",
        impactRecord: {
            individuals: "",
            communities: "",
        },
        progress: "",
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

    // Fetch welfare data
    useEffect(() => {
        const fetchWelfare = async () => {
            if (stringId && stringId !== "undefined") {
                await fetchWelfareById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchWelfare();
    }, [stringId, fetchWelfareById]);

    // Populate form when welfare data is loaded
    useEffect(() => {
        if (welfareData) {
            // Parse content blocks
            let contentBlocks: ContentBlock[] = [];
            if (Array.isArray(welfareData.content)) {
                contentBlocks = welfareData.content.map(
                    (section: any, index: number) => {
                        if (typeof section === "string") {
                            return {
                                id: `${index}-${Date.now()}`,
                                subtitle: "",
                                paragraphs: [section],
                            };
                        }
                        return {
                            id: `${index}-${Date.now()}`,
                            subtitle: section?.subtitle || section?.title || "",
                            paragraphs: Array.isArray(section?.paragraphs)
                                ? section.paragraphs
                                : section?.paragraph
                                ? [section.paragraph]
                                : section?.text
                                ? [section.text]
                                : [""],
                        };
                    }
                );
            }

            // Ensure at least one content block
            if (contentBlocks.length === 0) {
                contentBlocks = [
                    {
                        id: "1",
                        subtitle: "",
                        paragraphs: [""],
                    },
                ];
            }

            // Format date for input field (YYYY-MM-DD)
            let formattedDate = "";
            if (welfareData.startDate) {
                const date = new Date(welfareData.startDate);
                formattedDate = date.toISOString().split("T")[0];
            }

            setFormData({
                title: welfareData.title || "",
                summary: welfareData.summary || "",
                image: null,
                imagePreview: welfareData.image || null,
                category: welfareData.category || "",
                status: welfareData.status || "active",
                startDate: formattedDate,
                budget: welfareData.budget || "",
                successRate: welfareData.successRate || "",
                impactRecord: {
                    individuals: welfareData.impactRecord?.individuals || "",
                    communities: welfareData.impactRecord?.communities || "",
                },
                progress: welfareData.progress || "",
                partners: Array.isArray(welfareData.partners)
                    ? welfareData.partners
                    : [],
                partnersInput: "",
                content: contentBlocks,
            });
        }
    }, [welfareData]);

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

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, budget: e.target.value });
    };

    const handleSuccessRateChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, successRate: e.target.value });
    };

    const handleImpactRecordChange = (
        field: "individuals" | "communities",
        value: string
    ) => {
        setFormData({
            ...formData,
            impactRecord: {
                ...formData.impactRecord,
                [field]: value,
            },
        });
    };

    const handleProgressChange = (value: string) => {
        setFormData({ ...formData, progress: value });
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

        // Check if we have an image (either existing or new)
        if (!formData.imagePreview && !formData.image) {
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

        // Build FormData
        const fd = new FormData();
        fd.append("title", formData.title.trim());
        fd.append("summary", formData.summary.trim());
        fd.append("category", formData.category);
        fd.append("status", formData.status);
        fd.append("startDate", formData.startDate);

        // Append new image if provided
        if (formData.image) {
            fd.append("image", formData.image);
        }

        // Append partners as array
        formData.partners.forEach((partner) => {
            fd.append("partners", partner);
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

        // Append optional fields
        if (formData.budget) {
            fd.append("budget", formData.budget.trim());
        }
        if (formData.successRate) {
            fd.append("successRate", formData.successRate.trim());
        }
        if (formData.progress) {
            fd.append("progress", formData.progress);
        }
        if (formData.impactRecord.individuals) {
            fd.append(
                "impactIndividuals",
                formData.impactRecord.individuals.trim()
            );
        }
        if (formData.impactRecord.communities) {
            fd.append(
                "impactCommunities",
                formData.impactRecord.communities.trim()
            );
        }

        setSubmitting(true);
        try {
            const result = await editWelfare(stringId, fd);

            if (result?.ok) {
                toast.success("Welfare initiative updated successfully!");
                router.push(`/welfare/${stringId}`);
            } else {
                toast.error(
                    result?.message || "Failed to update welfare initiative"
                );
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(
                "Failed to update welfare initiative. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const getTotalParagraphs = () => {
        return formData.content.reduce(
            (sum, block) => sum + block.paragraphs.length,
            0
        );
    };

    // Loading state
    if (storeLoading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Welfare not found
    if (!storeLoading && fetchAttempted && !welfareData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Welfare initiative not found
                    </h2>
                    <p className="text-neutral-600">
                        The welfare initiative you're trying to edit doesn't
                        exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Welfare Initiative</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Featured Image *</CardTitle>
                        <CardDescription>
                            Update the featured image for your welfare
                            initiative (required)
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
                        {formData.imagePreview && !formData.image && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Currently using existing image. Upload a new one
                                to replace it.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Enter the title and summary of your welfare
                            initiative
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
                                required
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
                                required
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
                                    <SelectTrigger
                                        id="category"
                                        className="mt-2"
                                    >
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
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="budget">Budget</Label>
                                <Input
                                    id="budget"
                                    placeholder="Enter budget amount"
                                    value={formData.budget}
                                    onChange={handleBudgetChange}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="successRate">
                                    Success Rate (%)
                                </Label>
                                <Input
                                    id="successRate"
                                    placeholder="Enter success rate"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.successRate}
                                    onChange={handleSuccessRateChange}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <Label className="text-base font-semibold mb-4 block">
                                Impact Record
                            </Label>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="individuals">
                                        Individuals Impacted
                                    </Label>
                                    <Input
                                        id="individuals"
                                        placeholder="Enter number or description of individuals impacted"
                                        value={
                                            formData.impactRecord.individuals
                                        }
                                        onChange={(e) =>
                                            handleImpactRecordChange(
                                                "individuals",
                                                e.target.value
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="communities">
                                        Communities Impacted
                                    </Label>
                                    <Input
                                        id="communities"
                                        placeholder="Enter number or description of communities impacted"
                                        value={
                                            formData.impactRecord.communities
                                        }
                                        onChange={(e) =>
                                            handleImpactRecordChange(
                                                "communities",
                                                e.target.value
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="progress">
                                        Progress (Quarters)
                                    </Label>
                                    <Select
                                        value={formData.progress}
                                        onValueChange={(value) =>
                                            handleProgressChange(value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="progress"
                                            className="mt-2"
                                        >
                                            <SelectValue placeholder="Select progress" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">
                                                0% - Not Started
                                            </SelectItem>
                                            <SelectItem value="25">
                                                25% - Quarter Complete
                                            </SelectItem>
                                            <SelectItem value="50">
                                                50% - Half Complete
                                            </SelectItem>
                                            <SelectItem value="75">
                                                75% - Three Quarters Complete
                                            </SelectItem>
                                            <SelectItem value="100">
                                                100% - Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
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
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/welfare/${stringId}`)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 bg-button-blue hover:bg-light-blue"
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "Update Initiative"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
