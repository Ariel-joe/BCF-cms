import { get } from "http";
import { create } from "zustand";

const useBlogStore = create((set) => ({
    blogs: [],
    singleBlog: null,
    loading: false,
    postBlog: async (blogData) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/blog/create`;

            let res;

            // If caller already built a FormData (recommended), forward it directly
            if (
                typeof FormData !== "undefined" &&
                blogData instanceof FormData
            ) {
                res = await fetch(url, {
                    method: "POST",
                    body: blogData,
                    credentials: "include",
                });
            } else {
                // Fallback: build FormData if files are present in the object, otherwise send JSON
                const hasFile =
                    (blogData.featuredImage &&
                        blogData.featuredImage instanceof File) ||
                    (blogData.pdfFile && blogData.pdfFile instanceof File);

                if (hasFile) {
                    const fd = new FormData();
                    if (blogData.title) fd.append("title", blogData.title);
                    if (blogData.summary)
                        fd.append("summary", blogData.summary);
                    // Append tags[] so multer/body-parser sees an array on the server
                    if (Array.isArray(blogData.tags)) {
                        blogData.tags.forEach((t) => fd.append("tags[]", t));
                    } else if (blogData.tags) {
                        fd.append("tags[]", blogData.tags);
                    }
                    if (blogData.content)
                        fd.append("content", JSON.stringify(blogData.content));

                    // Files: use the field names your server expects: 'image' and 'pdf'
                    if (
                        blogData.featuredImage &&
                        blogData.featuredImage instanceof File
                    ) {
                        fd.append("image", blogData.featuredImage);
                    }
                    if (blogData.pdfFile && blogData.pdfFile instanceof File) {
                        fd.append("pdf", blogData.pdfFile);
                        // include pdfTitle if provided
                        if (blogData.pdfTitle)
                            fd.append("pdfTitle", blogData.pdfTitle);
                        else fd.append("pdfTitle", blogData.pdfFile.name || "");
                    }

                    res = await fetch(url, {
                        method: "POST",
                        body: fd,
                        credentials: "include",
                    });
                } else {
                    res = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(blogData),
                        credentials: "include",
                    });
                }
            }

            const contentType = res.headers.get("content-type") || "";
            let json = {};
            if (contentType.includes("application/json")) {
                try {
                    json = await res.json();
                } catch (err) {
                    console.error("Failed to parse blog create response", err);
                }
            }

            if (!res.ok) {
                return { ok: false, status: res.status, ...json };
            }

            return { ok: true, status: res.status, ...json };
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                status: 0,
                message: error?.message || "Network error",
            };
        }
    },

    allBlogs: async () => {
        try {
            set({ loading: true });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/blog/`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                try {
                    const { data } = await res.json();
                    set({ blogs: data || [], loading: false });
                } catch (err) {
                    console.error("Failed to parse allBlogs response", err);
                }
            }

            if (!res.ok) {
                return { ok: false, status: res.status };
            }

            return { ok: true, status: res.status };
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                status: 0,
                message: error?.message || "Network error",
            };
        }
    },

    getBlogById: async (id) => {
        try {
            set({ loading: true, singleBlog: null });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/blog/${id}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.ok) {
                const response = await res.json();

                set({ singleBlog: response?.data || {}, loading: false });
                return;
            }
        } catch (error) {
            console.error(error);
            set({ singleBlog: null, loading: false });
            return {
                ok: false,
                status: 0,
                message: error?.message || "Network error",
            };
        }
    },

    editBlog: async (id, blogData) => {
        try {
            set({ loading: true });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/blog/update/${id}`;
            const res = await fetch(url, {
                method: "PUT",
                body: blogData,
                credentials: "include",
            });

            if (res.ok) {
                const response = await res.json();
                set({ singleBlog: response?.data || null, loading: false });
                return { ok: true, data: response.data };
            } else {
                const error = await res.json();
                set({ loading: false });
                return {
                    ok: false,
                    status: res.status,
                    message: error.message || "Failed to update blog",
                };
            }
        } catch (error) {
            console.error(error);
            set({ loading: false });
            return {
                ok: false,
                status: 0,
                message: error?.message || "Network error",
            };
        }
    },
}));

export { useBlogStore };
