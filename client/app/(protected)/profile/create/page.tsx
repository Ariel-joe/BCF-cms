import { ProfileForm } from '@/components/profile-form'
import React from 'react'

export const metadata = {
    title: "Create Profile",
    description: "Create and publish a new profile",
};

export default function page() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-2 text-page-title">
                            Create Profile
                        </h1>
                    </div>
                    <ProfileForm />
                </div>
            </main>
  )
}
