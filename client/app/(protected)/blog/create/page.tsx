import { BlogForm } from "@/components/blog-form";

export const metadata = {
    title: "Create Blog Post",
    description: "Create and publish a new blog post",
};

export default function CreateBlogPage() {
    return (
        <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Publish Blog or Update
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Create and publish a new blog post to share updates and
                        news.
                    </p>
                </div>
                <BlogForm />
            </div>
        </main>
    );
}
