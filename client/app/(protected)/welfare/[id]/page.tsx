"use client";
import LoadingSkeleton from "@/components/loading-comp";
import { useWelfareStore } from "@/stores/welfareStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function page() {
    // get the :id param from the URL
    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    const { fetchWelfareById, welfareData, loading, deleteWelfare } =
        useWelfareStore();
    const [fetchAttempted, setFetchAttempted] = React.useState(false);

    const handleDelete = async () => {
        if (welfareData && (welfareData.id || welfareData._id)) {
            const deleted = await deleteWelfare(
                welfareData.id ?? welfareData._id
            );
            if (deleted) {
                toast.success("Welfare post deleted successfully");
                router.push("/welfare");
            } else {
                toast.error("Failed to delete welfare post");
            }
        }
    };

    useEffect(() => {
        const fetchBlog = async () => {
            if (stringId && stringId !== "undefined") {
                await fetchWelfareById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchBlog();
    }, [stringId, fetchWelfareById]); // Fixed: use stringId instead of id

    // Show loading state
    if (loading || !fetchAttempted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSkeleton />
            </div>
        );
    }

    // Show error state if no blog found
    if (!loading && fetchAttempted && !welfareData) {
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
        <>
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 mb-4 leading-tight">
                                {welfareData.title}
                            </h1>
                            <div className="flex gap-3">
                                <div className="space-x-3 mb-4">
                                    <span className="bg-neutral-300 text-neutral-700 px-3 py-1 rounded-full text-sm">
                                        {welfareData.status}
                                    </span>
                                </div>
                                <div className="space-x-3 mb-4">
                                    <span className="bg-light-blue text-white px-3 py-1 rounded-full text-sm">
                                        {welfareData.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-left text-neutral-600 mb-6">
                                {welfareData.summary}
                            </p>

                            <div>
                                {/* delete button and update button */}
                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex gap-3">
                                    <a
                                        href={`/welfare/edit/${
                                            welfareData.id ?? welfareData._id
                                        }`}
                                        className="items-center text-center w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                                    >
                                        Update
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete()}
                                        className="text-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 w-full text-white text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:order-first">
                            <img
                                src={welfareData.image}
                                alt="welfareData image"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section id="welfareData-overview" className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg p-8 border border-neutral-200">
                                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                                    Program Overview
                                </h2>
                                <div className="prose prose-neutral max-w-none text-justify">
                                    {welfareData.content &&
                                    Array.isArray(welfareData.content) ? (
                                        welfareData.content.map(
                                            (section: any, i: number) => {
                                                if (
                                                    typeof section === "string"
                                                ) {
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
                                                const paragraphs =
                                                    Array.isArray(
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
                                                            <h2 className="text-xl font-semibold text-neutral-900 mt-12 mb-6">
                                                                {subtitle}
                                                            </h2>
                                                        )}
                                                        {paragraphs.map(
                                                            (
                                                                p: any,
                                                                idx: number
                                                            ) => (
                                                                <p
                                                                    key={idx}
                                                                    className="text-base text-neutral-700 leading-relaxed mb-6"
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
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-lg p-6 border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    Program Statistics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-600">
                                            Individuals Supported
                                        </span>
                                        <span className="text-neutral-900">
                                            {
                                                welfareData.impactRecord
                                                    .individuals
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-600">
                                            Partners
                                        </span>
                                        <div className="text-neutral-900 flex flex-wrap text-sm">
                                            {Array.isArray(welfareData.partners)
                                                ? welfareData.partners.join(
                                                      ", "
                                                  )
                                                : welfareData.partners}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-600">
                                            Communities Reached
                                        </span>
                                        <span className="text-neutral-900">
                                            {
                                                welfareData.impactRecord
                                                    .communities
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-600">
                                            Success Rate
                                        </span>
                                        <span className="text-neutral-900">
                                            {welfareData.successRate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    Program Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">
                                            Started:
                                        </span>
                                        <span className="text-neutral-900">
                                            {new Date(
                                                welfareData.startDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">
                                            Budget:
                                        </span>
                                        <span className="text-neutral-900">
                                            Ksh {welfareData.budget}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">
                                            Coordinator:
                                        </span>
                                        <span className="text-neutral-900">
                                            {welfareData.coordinator.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
