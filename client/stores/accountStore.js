import { create } from "zustand";

const useAccountStore = create((set) => ({
    accounts: [],
    accountData: null,
    loading: false,

    fetchAccounts: async () => {
        try {
            set({ loading: true });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/account`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            const { data } = await res.json();
            set({ accounts: data, loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },

    getAccountById: async (id) => {
        try {
            set({ loading: true });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/account/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!res.ok) {
                set({ accountData: null, loading: false });
                return { ok: false };
            }

            const { data } = await res.json();
            set({ accountData: data, loading: false });
            return { ok: true, data };
        } catch (error) {
            console.error(error);
            set({ accountData: null, loading: false });
            return { ok: false };
        }
    },

    updateAccountDetails: async (id, updatedData) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/account/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(updatedData),
                }
            );
            if (!res.ok) {
                throw new Error("Failed to update account details");
            }
            const { data } = await res.json();
            set({ accountData: data });
            return { ok: true, data };
        } catch (error) {
            console.error(error);
            return { ok: false };
        }
    },

    deleteAccount: async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/account/delete/${id}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    activateAccount: async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/account/activate/${id}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.ok) {
                const { data } = await res.json();
                set({ accountData: data, loading: false });
                return true;
            } else {
                return false;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    deactivateAccount: async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/account/deactivate/${id}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.ok) {
                const { data } = await res.json();
                set({ accountData: data, loading: false });
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

export { useAccountStore };
