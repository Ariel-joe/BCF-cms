"use client";
import LoadingSkeleton from "@/components/loading-comp";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSkeleton />
        </div>
    );
}
