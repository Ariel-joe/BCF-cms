"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import LoadingSkeleton from "@/components/loading-comp";
import { useWelfareStore } from "@/stores/welfareStore";
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

export default function Page() {
    /* --------------------------------------------------
       Route params
    -------------------------------------------------- */
    const params = useParams();
    const id = params?.id;
    const stringId = String(id);
    const router = useRouter();

    /* --------------------------------------------------
       Stores
    -------------------------------------------------- */
    const { fetchWelfareById, welfareData, loading, deleteWelfare } =
        useWelfareStore();

    const user = useAuthStore((state) => state.user);
    const permissions = user?.permissions || [];

    const [fetchAttempted, setFetchAttempted] = React.useState(false);

    /* --------------------------------------------------
       Delete handler
    -------------------------------------------------- */
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

    /* --------------------------------------------------
       Fetch welfare
    -------------------------------------------------- */
    useEffect(() => {
        const fetchWelfare = async () => {
            if (stringId && stringId !== "undefined") {
                await fetchWelfareById(stringId);
                setFetchAttempted(true);
            }
        };
        fetchWelfare();
    }, [stringId, fetchWelfareById]);

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
    if (!loading && fetchAttempted && !welfareData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Welfare not found
                    </h2>
                    <p className="text-neutral-600">
                        The welfare post you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ---------------- Header Section ---------------- */}
            <section className="py-8 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 mb-4 leading-tight">
                                {welfareData.title}
                            </h1>

                            <div className="flex gap-3">
                                <span className="bg-neutral-300 text-neutral-700 px-3 py-1 rounded-full text-sm">
                                    {welfareData.status}
                                </span>

                                <span className="bg-light-blue text-white px-3 py-1 rounded-full text-sm">
                                    {welfareData.category}
                                </span>
                            </div>

                            <p className="text-left text-neutral-600 mb-6 mt-4">
                                {welfareData.summary}
                            </p>

                            {/* ---------------- Actions ---------------- */}
                            {(hasPermission(
                                permissions,
                                "welfare:update"
                            ) ||
                                hasPermission(
                                    permissions,
                                    "welfare:delete"
                                )) && (
                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex gap-3">
                                    {hasPermission(
                                        permissions,
                                        "welfare:update"
                                    ) && (
                                        <Link
                                            href={`/welfare/edit/${
                                                welfareData.id ??
                                                welfareData._id
                                            }`}
                                            className="items-center text-center w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                                        >
                                            Update
                                        </Link>
                                    )}

                                    {hasPermission(
                                        permissions,
                                        "welfare:delete"
                                    ) && (
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
                        </div>

                        <div className="lg:order-first">
                            <img
                                src={welfareData.image}
                                alt="Welfare image"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------- Content Section ---------------- */}
            <section className="py-16 bg-neutral-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg p-8 border border-neutral-200">
                                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                                    Program Overview
                                </h2>

                                <div className="prose prose-neutral max-w-none text-justify">
                                    {Array.isArray(welfareData.content) ? (
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

                        {/* ---------------- Sidebar Info ---------------- */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg p-6 border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    Program Statistics
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
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

                                    <div className="flex justify-between">
                                        <span className="text-neutral-600">
                                            Partners
                                        </span>
                                        <span className="text-neutral-900 text-sm">
                                            {Array.isArray(
                                                welfareData.partners
                                            )
                                                ? welfareData.partners.join(
                                                      ", "
                                                  )
                                                : welfareData.partners}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
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

                                    <div className="flex justify-between">
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
                                            Ksh{" "}
                                            {parseInt(
                                                welfareData.budget
                                            ).toLocaleString()}
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
