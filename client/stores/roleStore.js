import { create } from "zustand";

const useRoleStore = create((set) => ({
    roles: [],
    loading: false,
    fetchRoles: async () => {
        try {
            set({ loading: true });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/role`,
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
                set({ roles: data, loading: false });
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

export { useRoleStore };
