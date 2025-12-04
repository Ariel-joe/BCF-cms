import EditProfileForm from "@/components/update-profile-form";

export const metadata = {
    title: "Update profile Details",
    description: "Update and publish an existing profile",
};

export default function EditProfilePage() {
    return (
        <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Edit Profile
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Update an existing profile to keep your team and board members information current.
                    </p>
                </div>
                <EditProfileForm />
            </div>
        </main>
    );
}
