"use client";
import React, { useEffect } from 'react'
import { BlogCard } from '@/components/blog-card'
import { useBlogStore } from '@/stores/blogStore';


export default function page() {

    const { blogs, allBlogs } = useBlogStore();

    useEffect(() => {
        allBlogs();
    }, []);
  return (
      <div className="container mx-auto px-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any, index: number) => (
              <BlogCard key={index} blog={blog} />
          ))}
          </div>
      </div>
  );
}
