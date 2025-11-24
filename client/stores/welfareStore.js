import { create } from "zustand";

const useWelfareStore = create((set) => ({
    loading: false,
    welfarePosts: [],
    createWelfarePost: async (welfareData) => {
        try {
            set({ loading: true });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/welfare/create`;
            const res = await fetch(url, {
                method: "POST",
                body: welfareData,
                credentials: "include",
            });
            if (res.ok) {
                const response = await res.json();
                set({ loading: false });
                return { ok: true, data: response.data };
            } else {
                const error = await res.json();
                set({ loading: false });
                return {
                    ok: false,
                    status: res.status,
                    message: error.message || "Failed to create welfare post",
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

export { useWelfareStore };