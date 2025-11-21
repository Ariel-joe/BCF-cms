import { create } from "zustand";

const useBlogStore = create(() => ({
    postBlog: async (blogData) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/blog/create`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogData),
                credentials: "include",
            });

            if (res.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
}));

export { useBlogStore };
