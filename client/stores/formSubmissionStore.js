import { create } from "zustand";

const useFormSubmissionStore = create((set) => ({
    submissions: [],
    submissionData: null,
    loading: false,

    getSubmissions: async () => {
        set({ loading: true, submissions: [] });

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/form`,
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
                set({ submissions: data, loading: false });
            } else {
                set({ submissions: [], loading: false });
            }
        } catch (error) {
            set({ submissions: [], loading: false });
            console.error(error);
        }
    },

    getSubmissionById: async (id) => {
        try {
            set({ loading: true });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/form/${id}`,
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
                set({ submissionData: data, loading: false });
                return { ok: true, data };
            } else {
                set({ submissionData: null, loading: false });
                return { ok: false };
            }
        } catch (error) {
            set({ submissionData: null, loading: false });
            console.error(error);
            return { ok: false };
        }
    },
}));

export { useFormSubmissionStore };
