"use client";

import type React from "react";

import { useState } from "react";
import { FileText, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onFileChange: (file: File | null) => void;
    fileName: string | undefined;
}

export function FileUpload({ onFileChange, fileName }: FileUploadProps) {
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
        if (file && file.type === "application/pdf") {
            onFileChange(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            onFileChange(file);
        }
    };

    const handleClear = () => {
        onFileChange(null);
    };

    if (fileName) {
        return (
            <div className="flex items-center gap-3 p-4 bg-muted border border-border">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        PDF file selected
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={handleClear}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
            }`}
        >
            <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <div className="mb-3">
                <p className="text-sm font-medium text-foreground">
                    Upload PDF (Optional)
                </p>
                <p className="text-xs text-muted-foreground">
                    Drag and drop or click to browse
                </p>
            </div>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
            />
            <label htmlFor="pdf-upload">
                <Button type="button" variant="outline" asChild>
                    <span>Choose PDF</span>
                </Button>
            </label>
        </div>
    );
}
