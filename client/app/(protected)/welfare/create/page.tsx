import { WelfareForm } from "@/components/welfare-form";
import React from "react";

export const metadata = {
    title: "Create Welfare Post",
    description: "Create and publish a new welfare post",
};

export default function page() {
    return (
        <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-full mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2 text-page-title">
                        Publish Welfare
                    </h1>
                </div>
                <WelfareForm />
            </div>
        </main>
    );
}
