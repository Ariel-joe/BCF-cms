import { CreateAccountForm } from "@/components/account-form";

export default function CreateAccountPage() {
    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Add a new user account to the system
                    </p>
                </div>

                <CreateAccountForm />
            </div>
        </div>
    );
}
