"use client";
import { useBlogStore } from "@/stores/blogStore";
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
import { ImageUpload } from "@/components/image-upload";
import { FileUpload } from "@/components/file-upload";
import { ContentBlockForm } from "@/components/content-block-form";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface ContentBlock {
    id: string;
    subtitle: string;
    paragraphs: string[];
}

interface BlogFormData {
    title: string;
    summary: string;
    featuredImage: File | null;
    featuredImagePreview: string | null;
    pdfFile: File | null;
    pdfTitle: string;
    tags: string;
    content: ContentBlock[];
    keepExistingPdf: boolean;
}

export default function EditBlogForm() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const stringId = String(id);

    const {
        getBlogById,
        singleBlog,
        loading: storeLoading,
        editBlog,
    } = useBlogStore();
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        summary: "",
        featuredImage: null,
        featuredImagePreview: null,
        pdfFile: null,
        pdfTitle: "",
        tags: "",
        content: [
            {
                id: "1",
                subtitle: "",
                paragraphs: [""],
            },
        ],
        keepExistingPdf: true,
    });

    // Fetch blog data
    useEffect(() => {
        const fetchBlog = async () => {
            if (stringId && stringId !== "undefined") {
                await getBlogById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchBlog();
    }, [stringId, getBlogById]);

    // Populate form when blog data is loaded
    useEffect(() => {
        if (singleBlog) {
            // Parse content blocks
            let contentBlocks: ContentBlock[] = [];
            if (Array.isArray(singleBlog.content)) {
                contentBlocks = singleBlog.content.map(
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

            // Parse tags
            const tagsString = Array.isArray(singleBlog.tags)
                ? singleBlog.tags.join(", ")
                : "";

            setFormData({
                title: singleBlog.title || "",
                summary: singleBlog.summary || "",
                featuredImage: null,
                featuredImagePreview: singleBlog.image || null,
                pdfFile: null,
                pdfTitle: singleBlog.pdf?.title || "",
                tags: tagsString,
                content: contentBlocks,
                keepExistingPdf: !!singleBlog.pdf,
            });
        }
    }, [singleBlog]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, title: e.target.value });
    };

    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, summary: e.target.value });
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, tags: e.target.value });
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

    const handleRemoveExistingPdf = () => {
        setFormData({
            ...formData,
            keepExistingPdf: false,
            pdfFile: null,
            pdfTitle: "",
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
        if (!formData.featuredImagePreview && !formData.featuredImage) {
            toast.warning("Please upload a featured image");
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

        // Parse tags from comma-separated string to array
        const tagsArray = formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        if (tagsArray.length > 0) {
            tagsArray.forEach((tag) => fd.append("tags[]", tag));
        }

        // Clean content
        const contentArray = formData.content
            .map((block) => ({
                subtitle: block.subtitle.trim(),
                paragraphs: block.paragraphs
                    .map((p) => p.trim())
                    .filter(Boolean),
            }))
            .filter((block) => block.subtitle && block.paragraphs.length > 0);

        fd.append("content", JSON.stringify(contentArray));

        // Append new image if provided
        if (formData.featuredImage) {
            fd.append("image", formData.featuredImage);
        }

        // Handle PDF
        if (formData.pdfFile) {
            // New PDF file uploaded
            fd.append("pdf", formData.pdfFile);
            fd.append(
                "pdfTitle",
                formData.pdfTitle.trim() || formData.pdfFile.name
            );
        } else if (!formData.keepExistingPdf) {
            // User wants to remove the PDF
            fd.append("removePdf", "true");
        }
        // If keepExistingPdf is true and no new file, backend keeps existing PDF

        setSubmitting(true);
        try {
            const result = await editBlog(stringId, fd);

            if (result?.ok) {
                toast.success("Blog updated successfully!");
                router.push(`/blog/${stringId}`);
            } else {
                toast.error(result?.message || "Failed to update blog");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update blog. Please try again.");
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
                <div className="text-lg">Loading blog data...</div>
            </div>
        );
    }

    // Blog not found
    if (!storeLoading && fetchAttempted && !singleBlog) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
                    <p className="text-neutral-600">
                        The blog post you're trying to edit doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Featured Image Section */}
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Featured Image *</CardTitle>
                        <CardDescription>
                            Update the featured image for your blog post
                            (required)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            onImageChange={(file, preview) => {
                                setFormData({
                                    ...formData,
                                    featuredImage: file,
                                    featuredImagePreview: preview,
                                });
                            }}
                            preview={formData.featuredImagePreview}
                        />
                        {formData.featuredImagePreview &&
                            !formData.featuredImage && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Currently using existing image. Upload a new
                                    one to replace it.
                                </p>
                            )}
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Enter the title and summary of your blog post
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="Enter an engaging blog title"
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="mt-2 py-5"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="summary">Summary *</Label>
                            <Textarea
                                id="summary"
                                placeholder="Write a brief summary of your blog post"
                                value={formData.summary}
                                onChange={handleSummaryChange}
                                rows={4}
                                className="mt-2 rounded-none"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                        <CardDescription>
                            Add comma-separated tags to categorize your post
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            placeholder="e.g., Technology, Web Development, React"
                            value={formData.tags}
                            onChange={handleTagsChange}
                            className="py-5"
                        />
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

                {/* File Uploads */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                        <CardDescription>
                            Optionally attach a PDF file to your blog post
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Show existing PDF if present */}
                        {formData.keepExistingPdf &&
                            singleBlog?.pdf &&
                            !formData.pdfFile && (
                                <div className="mb-4 p-4 bg-muted rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-6 h-6 text-red-600"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 14.25v-2.036a4.5 4.5 0 00-1.232-3.09L13.5 4.5H6A1.5 1.5 0 004.5 6v12A1.5 1.5 0 006 19.5h12a1.5 1.5 0 001.5-1.5v-3.75z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    Current PDF
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {singleBlog.pdf.title ||
                                                        "Existing PDF"}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveExistingPdf}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {/* File upload */}
                        <FileUpload
                            onFileChange={(file) => {
                                setFormData({
                                    ...formData,
                                    pdfFile: file,
                                    keepExistingPdf: false,
                                });
                            }}
                            fileName={formData.pdfFile?.name}
                        />

                        {formData.pdfFile && (
                            <div className="mt-4">
                                <Label htmlFor="pdfTitle">
                                    PDF Title (optional)
                                </Label>
                                <Input
                                    id="pdfTitle"
                                    placeholder="Enter PDF title"
                                    value={formData.pdfTitle}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pdfTitle: e.target.value,
                                        })
                                    }
                                    className="mt-2 py-3"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/blog/${stringId}`)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 bg-button-blue hover:bg-light-blue"
                        disabled={submitting}
                    >
                        {submitting ? "Updating..." : "Update Post"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
