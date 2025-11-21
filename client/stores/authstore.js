import { create } from "zustand";

const useAuthStore = create((set) => ({
    session: null,
    user: null,
    login: async (userData) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/login`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // include credentials so backend Set-Cookie is honored by the browser
                credentials: "include",
                body: JSON.stringify(userData),
            });

            const contentType = res.headers.get("content-type") || "";
            let json = {};
            if (contentType.includes("application/json")) {
                try {
                    json = await res.json();
                } catch (err) {
                    console.error("Failed to parse JSON", err);
                    json = {};
                }
            }

            // Server responds with { success: boolean, data: {...} } on your implementation
            if (res.ok && json && json.data) {
                // Save returned user info (name, email, phone, role) into store
                set({ user: json.data || null, session: null });
            }

            // Return a consistent object to callers: ok (fetch success), status, and server JSON
            return { ok: res.ok, status: res.status, ...json };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}));

export { useAuthStore };
