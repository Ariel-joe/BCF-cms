import EditWelfareForm from '@/components/update-welfare-form';
import React from 'react'

export const metadata = {
    title: "Update Blog Post",
    description: "Update and publish an existing blog post",
};

export default function EditWelfarePage() {
  

      return (
          <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-full mx-auto">
                  <div className="mb-8">
                      <h1 className="text-2xl font-bold mb-2 text-page-title">
                          Edit Welfare Initiatives
                      </h1>
                  </div>
                  <EditWelfareForm />
              </div>
          </main>
      );
}
