import { WelfareForm } from "@/components/welfare-form";
import React from "react";

export const metadata = {
    title: "Create Welfare Post",
    description: "Create and publish a new welfare post",
};

export default function page() {
    return (
        <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Publish Welfare
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Create and publish a new welfare post to share updates and
                        news.
                    </p>
                </div>
                <WelfareForm />
            </div>
        </main>
    );
}
