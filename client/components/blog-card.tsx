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
        _id: string;
        title: string;
    };
}

export function BlogCard({ blog }: BlogCardProps) {
    const { image, datePublished, author, summary, _id, title } = blog;

    console.log(blog, "id");
    

    const preview = summary
        ? summary.length > 10
            ? summary.substring(0, 100) + "..."
            : summary
        : "";
    return (
        <>
            <article className="bg-white border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
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
                        <span>{new Date(datePublished).toLocaleString()}</span>
                        <span>•</span>
                        <span>{author.name}</span>
                    </div>
                    <h3 className="text-lg text-neutral-900 mb-3 leading-tight">
                        {title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                        {preview}
                    </p>
                    <div>
                        <Link href={`/blog/${_id}`} className="w-full">
                            <button className="text-white text-center w-full bg-btn-view cursor-pointer text-sm hover:text-white hover:bg-light-blue py-1 transition-colors gap-2">
                                Details
                            </button>
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};