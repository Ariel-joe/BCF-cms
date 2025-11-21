"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface ContentBlock {
    id: string;
    subtitle: string;
    paragraphs: string[];
}

interface ContentBlockFormProps {
    block: ContentBlock;
    onUpdate: (block: ContentBlock) => void;
    blockNumber: number;
}

export function ContentBlockForm({
    block,
    onUpdate,
    blockNumber,
}: ContentBlockFormProps) {
    const handleSubtitleChange = (value: string) => {
        onUpdate({ ...block, subtitle: value });
    };

    const handleParagraphChange = (index: number, value: string) => {
        const newParagraphs = [...block.paragraphs];
        newParagraphs[index] = value;
        onUpdate({ ...block, paragraphs: newParagraphs });
    };

    const handleAddParagraph = () => {
        onUpdate({ ...block, paragraphs: [...block.paragraphs, ""] });
    };

    const handleRemoveParagraph = (index: number) => {
        if (block.paragraphs.length > 1) {
            const newParagraphs = block.paragraphs.filter(
                (_, i) => i !== index
            );
            onUpdate({ ...block, paragraphs: newParagraphs });
        }
    };

    return (
        <Card className="p-4 border border-border bg-[#d6e8ff]">
            <div className="space-y-4">
                <div>
                    <Label
                        htmlFor={`subtitle-${block.id}`}
                        className="text-base font-semibold"
                    >
                        Section {blockNumber}: Subtitle
                    </Label>
                    <Input
                        id={`subtitle-${block.id}`}
                        placeholder="Enter section subtitle"
                        value={block.subtitle}
                        onChange={(e) => handleSubtitleChange(e.target.value)}
                        className="mt-2 bg-accent"
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-base font-semibold">
                        Paragraphs ({block.paragraphs.length})
                    </Label>

                    {block.paragraphs.map((paragraph, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white font-medium px-2 py-1 bg-[#0d1fc6]">
                                    P{index + 1}
                                </span>
                                {block.paragraphs.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleRemoveParagraph(index)
                                        }
                                        className="text-destructive hover:text-destructive ml-auto"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                            <Textarea
                                placeholder={`Paragraph ${
                                    index + 1
                                } content...`}
                                value={paragraph}
                                onChange={(e) =>
                                    handleParagraphChange(index, e.target.value)
                                }
                                rows={3}
                                className="rounded-none bg-accent"
                            />
                        </div>
                    ))}

                    <Button
                        type="button"
                        onClick={handleAddParagraph}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 text-white rounded-none bg-sec-btn"
                    >
                        <Plus className="w-3 h-3 mr-2" />
                        Add Paragraph
                    </Button>
                </div>
            </div>
        </Card>
    );
}
