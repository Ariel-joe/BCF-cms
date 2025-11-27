import EditBlogForm from "@/components/update-blog-form";

export const metadata = {
    title: "Update Blog Post",
    description: "Update and publish an existing blog post",
};

export default function EditBlogPage() {
    return (
        <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2 text-page-title">
                        Edit Blog Post
                    </h1>
                </div>
                <EditBlogForm />
            </div>
        </main>
    );
}
