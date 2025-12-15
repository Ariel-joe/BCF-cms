import { create } from "zustand";

const useWelfareStore = create((set) => ({
    loading: false,
    welfarePosts: [],
    welfareData: null,
    pagination: null,
    
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

    fetchWelfarePosts: async (page = 1) => {
        try {
            set({ loading: true });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/welfare?page=${page}&limit=10`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (res.ok) {
                const response = await res.json();
                
                // Append new welfare posts to existing ones for "Load More" functionality
                set((state) => ({
                    welfarePosts: page === 1 ? response.data : [...state.welfarePosts, ...response.data],
                    pagination: response.pagination,
                    loading: false
                }));
                return;
            }
            set({ loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },

    fetchWelfareById: async (id) => {
        try {
            set({ loading: true, welfareData: null });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/welfare/${id}`;
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (res.ok) {
                const response = await res.json();
                set({ welfareData: response?.data || {}, loading: false });
                return;
            }
            set({ loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false, welfareData: null });
        }
    },
    
    editWelfare: async (id, welfare) => {
        try {
            set({ loading: true });
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/welfare/update/${id}`;
            const res = await fetch(url, {
                method: "PUT",
                body: welfare,
                credentials: "include",
            });

            if (res.ok) {
                const response = await res.json();
                set({ welfareData: response?.data || null, loading: false });
                return { ok: true, data: response.data };
            } else {
                const error = await res.json();
                set({ loading: false });
                return {
                    ok: false,
                    status: res.status,
                    message: error.message || "Failed to update welfare",
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

    deleteWelfare: async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/welfare/delete/${id}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (res.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    },
}));

export { useWelfareStore };