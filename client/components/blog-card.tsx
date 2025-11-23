"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
    blog: {
        image: string;
        datePublished: string;
        author: {
            name: string;
        };
        summary: string;
        id: string;
        title: string;
    };
}

export function BlogCard({ blog }: BlogCardProps) {
    const { image, datePublished, author, summary, id, title } = blog;

    const preview = summary
        ? summary.length > 10
            ? summary.substring(0, 100) + "..."
            : summary
        : "";
    return (
        <>
            <article className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 w-full overflow-hidden">
                    <img
                        src={image}
                        alt="blog image"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-3">
                        <span>{datePublished}</span>
                        <span>•</span>
                        <span>{author.name}</span>
                    </div>
                    <h3 className="text-lg text-neutral-900 mb-3 leading-tight">
                        {title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                        {preview}
                    </p>
                    <div className="flex items-center justify-between">
                        <Link href={`/blog/${id}`}>
                            <button className="text-neutral-900 cursor-pointer text-sm hover:text-neutral-600 transition-colors flex gap-2">
                                Read More <ArrowRight size={22} />
                            </button>
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};