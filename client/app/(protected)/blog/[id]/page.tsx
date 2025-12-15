"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import LoadingSkeleton from "@/components/loading-comp";
import { useBlogStore } from "@/stores/blogStore";
import { useAuthStore } from "@/stores/authstore";

/* ------------------------------------------------------
   Permission helper
------------------------------------------------------ */
const hasPermission = (
    permissions: string[] = [],
    required: string
) => {
    if (!permissions?.length) return false;
    return permissions.includes(required);
};

export default function BlogDetailPage() {
    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    const { getBlogById, singleBlog, loading, deleteBlog } = useBlogStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);

    /* --------------------------------------------------
       Auth / permissions
    -------------------------------------------------- */
    const user = useAuthStore((state) => state.user);
    const permissions = user?.permissions || [];

    const handleDelete = async () => {
        if (singleBlog && (singleBlog.id || singleBlog._id)) {
            const deleted = await deleteBlog(singleBlog.id ?? singleBlog._id);
            if (deleted) {
                toast.success("Blog deleted successfully");
                router.push("/blog");
            } else {
                toast.error("Failed to delete blog");
            }
        }
    };

    useEffect(() => {
        const fetchBlog = async () => {
            if (stringId && stringId !== "undefined") {
                await getBlogById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchBlog();
    }, [stringId, getBlogById]);

    /* --------------------------------------------------
       Loading state
    -------------------------------------------------- */
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    /* --------------------------------------------------
       Error state
    -------------------------------------------------- */
    if (!loading && fetchAttempted && !singleBlog) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
                    <p className="text-neutral-600">
                        The blog post you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main id="blog-article-main">
            <article id="blog-article-container" className="bg-white">
                {/* ---------------- Header ---------------- */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-2xl sm:text-4xl text-neutral-900 font-bold leading-tight">
                        {singleBlog.title || "Untitled"}
                    </h1>

                    {singleBlog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center pt-4 mb-12">
                            <span className="text-sm text-neutral-600">
                                TAGS:
                            </span>
                            {singleBlog.tags.map((tag: string, i: number) => (
                                <span
                                    key={i}
                                    className="bg-button-blue text-white px-2 rounded-sm text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
                        <div className="text-neutral-900">
                            By{" "}
                            {singleBlog.author?.name || "Unknown Author"}
                        </div>

                        {singleBlog.datePublished && (
                            <div className="text-sm text-neutral-600">
                                {new Date(
                                    singleBlog.datePublished
                                ).toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* ---------------- Featured Image ---------------- */}
                <div className="max-w-4xl mx-auto px-4 mb-12">
                    <div className="bg-neutral-400 w-full h-96 flex items-center justify-center overflow-hidden">
                        {singleBlog.image ? (
                            <img
                                src={singleBlog.image}
                                alt={singleBlog.title || "Featured image"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="text-neutral-700">
                                No image available
                            </div>
                        )}
                    </div>
                </div>

                {/* ---------------- Content ---------------- */}
                <div className="max-w-4xl mx-auto px-4 pb-16 text-justify">
                    <div className="prose prose-lg">
                        {Array.isArray(singleBlog.content) ? (
                            singleBlog.content.map((section: any, i: number) => {
                                if (typeof section === "string") {
                                    return (
                                        <p
                                            key={i}
                                            className="text-sm text-neutral-700 mb-6"
                                        >
                                            {section}
                                        </p>
                                    );
                                }

                                const subtitle =
                                    section?.subtitle ||
                                    section?.title ||
                                    null;

                                const paragraphs = Array.isArray(
                                    section?.paragraphs
                                )
                                    ? section.paragraphs
                                    : section?.paragraphs
                                    ? [section.paragraphs]
                                    : section?.paragraph
                                    ? [section.paragraph]
                                    : section?.text
                                    ? [section.text]
                                    : [];

                                return (
                                    <div key={i}>
                                        {subtitle && (
                                            <h2 className="text-2xl font-semibold text-neutral-900 mt-12 mb-6">
                                                {subtitle}
                                            </h2>
                                        )}
                                        {paragraphs.map(
                                            (p: any, idx: number) => (
                                                <p
                                                    key={idx}
                                                    className="text-lg text-neutral-700 mb-6"
                                                >
                                                    {p}
                                                </p>
                                            )
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-neutral-600">
                                No content available.
                            </p>
                        )}
                    </div>
                </div>

                {/* ---------------- Actions ---------------- */}
                {(hasPermission(permissions, "blog:update") ||
                    hasPermission(permissions, "blog:delete")) && (
                    <div className="max-w-4xl mx-auto px-4 pb-16 flex gap-3">
                        {hasPermission(permissions, "blog:update") && (
                            <Link
                                href={`/blog/edit/${
                                    singleBlog.id ?? singleBlog._id
                                }`}
                                className="items-center text-center w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                            >
                                Update
                            </Link>
                        )}

                        {hasPermission(permissions, "blog:delete") && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 w-full text-white text-sm"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </article>
        </main>
    );
}
