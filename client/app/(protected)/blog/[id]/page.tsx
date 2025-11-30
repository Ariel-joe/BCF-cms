"use client";
import LoadingSkeleton from "@/components/loading-comp";
import { useBlogStore } from "@/stores/blogStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function BlogDetailPage() {
    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    const { getBlogById, singleBlog, loading, deleteBlog } = useBlogStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);

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
    }, [stringId, getBlogById]); // Fixed: use stringId instead of id

    // Show loading state
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Show error state if no blog found
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
                <div
                    id="article-header"
                    className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 py-8"
                >
                    <h1 className="text-2xl sm:text-4xl text-neutral-900 font-bold leading-tight">
                        {singleBlog.title || "Untitled"}
                    </h1>

                    {singleBlog.tags && singleBlog.tags.length > 0 && (
                        <div
                            id="article-tags"
                            className="flex flex-wrap gap-2 items-center pt-4 mb-12"
                        >
                            <span className="text-sm text-neutral-600">
                                TAGS:
                            </span>
                            {singleBlog.tags.map((tag: string, t: number) => (
                                <span
                                    key={t}
                                    className="bg-button-blue text-white px-2 rounded-sm text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
                        <div className="flex items-center space-x-4">
                            <div>
                                <div className="text-neutral-900">
                                    By{" "}
                                    {singleBlog.author?.name ||
                                        "Unknown Author"}
                                </div>
                            </div>
                        </div>

                        {singleBlog.datePublished && (
                            <div className="flex items-center space-x-6 text-sm text-neutral-600">
                                <div className="flex items-center space-x-2">
                                    <i className="fa-regular fa-calendar"></i>
                                    <span>
                                        {new Date(
                                            singleBlog.datePublished
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    id="article-featured-image"
                    className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 mb-12"
                >
                    <div className="bg-neutral-400 w-full h-96 flex items-center justify-center overflow-hidden">
                        {singleBlog.image ? (
                            <img
                                src={singleBlog.image}
                                alt={singleBlog.title || "Featured image"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                No image available
                            </div>
                        )}
                    </div>
                </div>

                <div
                    id="article-content"
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-justify"
                >
                    <div className="prose prose-lg">
                        {singleBlog.content &&
                        Array.isArray(singleBlog.content) ? (
                            singleBlog.content.map(
                                (section: any, i: number) => {
                                    if (typeof section === "string") {
                                        return (
                                            <p
                                                key={i}
                                                className="text-sm text-neutral-700 leading-relaxed mb-6"
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
                                                        className="text-lg text-neutral-700 leading-relaxed mb-6"
                                                    >
                                                        {p}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <p className="text-neutral-600">
                                No content available.
                            </p>
                        )}

                        {singleBlog.pdf && (
                            <>
                                <h3 className="text-xl font-semibold text-neutral-900 mt-12 mb-6">
                                    Download PDF
                                </h3>
                                <div className="flex items-center gap-3 bg-neutral-200 p-4">
                                    <div className="bg-blue-600 text-white p-2.5 rounded-lg flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 14.25v-2.036a4.5 4.5 0 00-1.232-3.09L13.5 4.5H6A1.5 1.5 0 004.5 6v12A1.5 1.5 0 006 19.5h12a1.5 1.5 0 001.5-1.5v-3.75z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 4.5v4.875c0 .621.504 1.125 1.125 1.125H19.5"
                                            />
                                        </svg>
                                    </div>

                                    <a
                                        href={singleBlog.pdf.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline truncate max-w-[250px]"
                                    >
                                        {singleBlog.pdf.title || "Download PDF"}
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    {/* delete button and update button */}
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex gap-3">
                        <Link
                            href={`/blog/edit/${
                                singleBlog.id ?? singleBlog._id
                            }`}
                            className="items-center text-center w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                        >
                            Update
                        </Link>

                        <button
                            type="button"
                            onClick={() => handleDelete()}
                            className="text-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 w-full text-white text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </article>
        </main>
    );
}
