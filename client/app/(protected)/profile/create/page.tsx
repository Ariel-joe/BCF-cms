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
                  <h1 className="text-3xl font-extrabold text-gray-900">
                      Create Profile
                  </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Create and publish a new profile to showcase your team and board members.
                    </p>
              </div>
              <ProfileForm />
          </div>
      </main>
  );
}
