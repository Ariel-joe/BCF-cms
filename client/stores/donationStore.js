import { create } from "zustand";

const useDonationStore = create((set) => ({
    donations: [],
    donationData: null,
    loading: false,
    pagination: null,
    
    getDonations: async (page = 1) => {
        set({ loading: true });
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/donations?page=${page}&limit=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            if (res.ok) {
                const response = await res.json();
                set({ 
                    donations: response.data, 
                    pagination: response.pagination,
                    loading: false 
                });
            } else {
                set({ donations: [], pagination: null, loading: false });
            }
        } catch (error) {
            set({ donations: [], pagination: null, loading: false });
            console.error(error);
        }
    },
    
    getDonationById: async (id) => {
        try {
            set({ loading: true });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/donations/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                set({ donationData: data, loading: false });
                return { ok: true, data };
            } else {
                set({ donationData: null, loading: false });
                return { ok: false };
            }
        } catch (error) {
            set({ donationData: null, loading: false });
            console.error(error);
            return { ok: false };
        }
    },
}));

export { useDonationStore };