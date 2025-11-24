import Link from "next/link";
import React from "react";
import { Progress } from "./ui/progress";
interface WelfareCardProps {
    welfare: {
        image: string;
        title: string;
        status: string;
        startDate: string;
        summary: string;
        progress: string;
        budget: string;
        _id: string;
    };
}

export default function WelfareCard({ welfare }: WelfareCardProps) {
    const { image, title, status, startDate, summary, progress, budget, _id } =
        welfare;
    const preview = summary
        ? summary.length > 10
            ? summary.substring(0, 100) + "..."
            : summary
        : "";

    return (
        <>
            <div className="bg-white border border-neutral-200 w-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-neutral-400 h-48 flex items-center justify-center overflow-hidden">
                    <img
                        src={image}
                        alt={title || "welfare image"}
                        className="w-full h-48 object-cover object-center"
                        loading="lazy"
                    />
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-sm rounded-full">
                            {status}
                        </span>
                        <span className="text-neutral-500 text-sm">{new Date(startDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg text-neutral-900 mb-3 font-bold">{title}</h3>
                    <p className="text-neutral-600 mb-4 text-sm">{preview}</p>
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                            <Progress value={parseInt(progress)} />
                            {/* <div className="bg-neutral-900 h-2 rounded-full w-2/3"></div> */}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-neutral-600">
                            Budget: Ksh {budget}
                        </span>
                        <Link href={`/welfare/${_id}`}>
                            <button className="px-4 py-2 bg-btn-view text-white text-sm hover:bg-neutral-800">
                                View Details
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
