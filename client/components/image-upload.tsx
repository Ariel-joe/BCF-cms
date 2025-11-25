"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    onImageChange: (file: File | null, preview: string | null) => void;
    preview: string | null;
}

export function ImageUpload({ onImageChange, preview }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            processImage(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImage(file);
        }
    };

    const processImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            onImageChange(file, event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleClear = () => {
        onImageChange(null, null);
    };

    if (preview) {
        return (
            <div className="space-y-3">
                <div className="relative w-full h-96 overflow-hidden justify-center border border-border">
                    <img
                        src={preview || "/placeholder.svg"}
                        alt="Featured image preview"
                        className="w-full h-full object-cover"
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleClear}
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive bg-transparent"
                >
                    <X className="w-4 h-4 mr-2" />
                    Remove Image
                </Button>
            </div>
        );
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
            }`}
        >
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <div className="mb-3">
                <p className="text-sm font-medium text-foreground">
                    Drag and drop your image here
                </p>
                <p className="text-xs text-muted-foreground">
                    or click to browse
                </p>
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
            />
            <label htmlFor="image-upload">
                <Button type="button" variant="outline" asChild>
                    <span>Browse Files</span>
                </Button>
            </label>
        </div>
    );
}
