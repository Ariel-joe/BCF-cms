"use client";
import React, { useEffect } from 'react'
import { BlogCard } from '@/components/blog-card'
import { useBlogStore } from '@/stores/blogStore';


export default function page() {

    const { blogs, allBlogs, loading } = useBlogStore();

    useEffect(() => {
        allBlogs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">loading...</div>
        );
    }

    return (
        <div className="container mx-auto px-6 mt-6">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">All Blogs</h1>
                    <p className="mt-1 text-sm text-gray-600">A collection of the latest posts from Beacon Of Compassion authors</p>
                </div>
                <div className="text-sm text-gray-500">
                    <span>Showing {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}</span>
                </div>
            </div>
        </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any, index: number) => (
              <BlogCard key={index} blog={blog} />
          ))}
          </div>
      </div>
  );
}
