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
import { ImageUpload } from "@/components/image-upload";
import { FileUpload } from "@/components/file-upload";
import { ContentBlockForm } from "@/components/content-block-form";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useBlogStore } from "@/stores/blogStore";

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
}

export function BlogForm() {
    const { postBlog } = useBlogStore();

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
    });
    const [loading, setLoading] = useState(false);

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

        if (!formData.featuredImage) {
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

        // Build FormData matching backend expectations
        const fd = new FormData();
        fd.append("title", formData.title.trim());
        fd.append("summary", formData.summary.trim());

        // Parse tags from comma-separated string to array
        const tagsArray = formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        // Send as tags[] so Express parses it as an array
        if (tagsArray.length > 0) {
            tagsArray.forEach((tag) => fd.append("tags[]", tag));
        }

        // Clean content: remove empty paragraphs and id field
        const contentArray = formData.content
            .map((block) => ({
                subtitle: block.subtitle.trim(),
                paragraphs: block.paragraphs
                    .map((p) => p.trim())
                    .filter(Boolean),
            }))
            .filter((block) => block.subtitle && block.paragraphs.length > 0);

        // Send content as JSON string
        fd.append("content", JSON.stringify(contentArray));

        // Append image file (required)
        if (formData.featuredImage) {
            fd.append("image", formData.featuredImage);
        }

        // Append PDF file and title (optional)
        if (formData.pdfFile) {
            fd.append("pdf", formData.pdfFile);
            fd.append(
                "pdfTitle",
                formData.pdfTitle.trim() || formData.pdfFile.name
            );
        }

        setLoading(true);
        try {
            const result = await postBlog(fd);

            if (result && result.ok) {
                toast.success("Blog posted successfully");
                // Reset form
                setFormData({
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
                });
            } else {
                toast.error(result?.message || "Failed to publish post");
            }
        } catch (err: any) {
            toast.error(err?.message || "Failed to publish post");
        } finally {
            setLoading(false);
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
            {/* Featured Image Section */}
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>
                        Upload a high-quality image for your blog post
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
                    <FileUpload
                        onFileChange={(file) => {
                            setFormData({ ...formData, pdfFile: file });
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
                {/* <Button type="button" variant="outline">
                    Save as Draft
                </Button> */}
                <Button
                    type="submit"
                    className="px-8 bg-button-blue hover:bg-light-blue"
                    disabled={loading}
                >
                    {loading ? "Publishing..." : "Publish Post"}
                </Button>
            </div>
        </form>
    );
}
