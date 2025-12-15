"use client";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "@/components/loading-comp";
import { useWelfareStore } from "@/stores/welfareStore";
import WelfareCard from "@/components/welfare-card";

export default function page() {
    const { welfarePosts, fetchWelfarePosts, loading, pagination } = useWelfareStore();
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchWelfarePosts(1);
        setFetchAttempted(true);
    }, []);

    const loadMore = async () => {
        const nextPage = currentPage + 1;
        await fetchWelfarePosts(nextPage);
        setCurrentPage(nextPage);
    };

    if (loading && !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    if (welfarePosts.length === 0 && fetchAttempted && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-semibold mb-4">No welfare posts found</h2>
                <p className="text-gray-600">
                    It seems there are no welfare initiatives available at the moment. Please
                    check back later.
                </p>
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
                            Showing {welfarePosts.length} of {pagination?.totalWelfares || 0}{" "}
                            {pagination?.totalWelfares === 1 ? "post" : "posts"}
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {welfarePosts.map((welfare: any, index: number) => (
                    <WelfareCard key={welfare._id || index} welfare={welfare} />
                ))}
            </div>

            {/* Load More Button */}
            {pagination?.hasMore && (
                <div className="flex justify-center mt-12 mb-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {/* End of Results Message */}
            {!pagination?.hasMore && welfarePosts.length > 0 && (
                <div className="text-center mt-12 mb-8">
                    <p className="text-gray-600">
                        You've reached the end of all welfare posts
                    </p>
                </div>
            )}
        </div>
    );
}