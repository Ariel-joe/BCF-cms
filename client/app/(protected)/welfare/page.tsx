"use client";
import React, { useEffect } from "react";
import LoadingSkeleton from "@/components/loading-comp";
import { useWelfareStore } from "@/stores/welfareStore";
import WelfareCard from "@/components/welfare-card";

export default function page() {
    const { welfarePosts, fetchWelfarePosts, loading } = useWelfareStore();

    useEffect(() => {
        fetchWelfarePosts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 mt-6">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Welfare initiatives
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            A collection of the latest welfare initiatives from Beacon Of
                            Compassion.
                        </p>
                    </div>
                    <div className="text-sm text-gray-500"> 
                        <span>
                            Showing {welfarePosts.length}{" "}
                            {welfarePosts.length === 1 ? "post" : "posts"}
                        </span>
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {welfarePosts.map((welfare: any, index: number) => (
                    <WelfareCard key={index} welfare={welfare} />
                ))}
            </div>
        </div>
    );
}
