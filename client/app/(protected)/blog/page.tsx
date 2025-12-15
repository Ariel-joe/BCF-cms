"use client";
import React, { useEffect, useState } from "react";
import { BlogCard } from "@/components/blog-card";
import { useBlogStore } from "@/stores/blogStore";
import LoadingSkeleton from "@/components/loading-comp";

export default function page() {
    const { blogs, allBlogs, loading, pagination } = useBlogStore();
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        allBlogs(1);
        setFetchAttempted(true);
    }, []);

    const loadMore = async () => {
        const nextPage = currentPage + 1;
        await allBlogs(nextPage);
        setCurrentPage(nextPage);
    };

    if (loading && !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    if (blogs.length === 0 && fetchAttempted && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-semibold mb-4">No blog posts found</h2>
                <p className="text-gray-600">
                    It seems there are no blog posts available at the moment. Please
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
                            All Blogs
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            A collection of the latest posts from Beacon Of
                            Compassion authors
                        </p>
                    </div>
                    <div className="text-sm text-gray-500">
                        <span>
                            Showing {blogs.length} of {pagination?.totalBlogs || 0}{" "}
                            {pagination?.totalBlogs === 1 ? "post" : "posts"}
                        </span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: any, index: number) => (
                    <BlogCard key={blog._id || index} blog={blog} />
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
            {!pagination?.hasMore && blogs.length > 0 && (
                <div className="text-center mt-12 mb-8">
                    <p className="text-gray-600">
                        You've reached the end of all blog posts
                    </p>
                </div>
            )}
        </div>
    );
}