import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            session: null,
            user: null,

            login: async (userData) => {
                try {
                    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/login`;
                    const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(userData),
                    });

                    const json = await res.json();

                    if (res.ok && json?.data) {
                        set({ user: json.data, session: null });
                    }

                    return { ok: res.ok, status: res.status, ...json };
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            },

            logout: async () => {
                try {
                    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/logout`;
                    const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });
                    if (res.ok) {
                        set({ user: null, session: null });
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    return false;
                    console.error(error);
                    throw error;
                }
            },

            forgotPassword: async (email) => {
                try {
                    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/forgot-pass`;
                    const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });

                    if (res.ok) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    return false;
                    console.error(error);
                    throw error;
                }
            },

            resetPassword: async (token, newPassword) => {
                try {
                    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/reset-pass/${token}`;
                    const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: newPassword }),
                    });
                    if (res.ok) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    return false;
                    console.error(error);
                    throw error;
                }
            },
        }),

        {
            name: "auth-storage", // the key in localStorage
            partialize: (state) => ({ user: state.user }), // only save user
        }
    )
);

export { useAuthStore };
