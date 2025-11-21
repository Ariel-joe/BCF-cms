import { BlogForm } from "@/components/blog-form";

export const metadata = {
    title: "Create Blog Post",
    description: "Create and publish a new blog post",
};

export default function CreateBlogPage() {
    return (
        <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-full mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2 text-page-title">
                        Publish Blog or Update
                    </h1>
                </div>
                <BlogForm />
            </div>
        </main>
    );
}
