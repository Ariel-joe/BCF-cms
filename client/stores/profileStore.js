const { create } = require("zustand");

const useProfileStore = create((set) => ({
    profile: null,
    loading: false,
    profilesData: [],

    createProfile: async (payload) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/profile/create`;
            let res;
            // If caller already built a FormData (recommended), forward it directly
            if (
                typeof FormData !== "undefined" &&
                payload instanceof FormData
            ) {
                res = await fetch(url, {
                    method: "POST",
                    body: payload,
                    credentials: "include",
                });
            } else {
                // Fallback: build FormData if files are present in the object, otherwise send JSON
                const hasFile =
                    (payload.featuredImage &&
                        payload.featuredImage instanceof File) ||
                    (payload.pdfFile && payload.pdfFile instanceof File);
                if (hasFile) {
                    const fd = new FormData();
                    if (payload.name) fd.append("name", payload.name);
                    if (payload.bio) fd.append("bio", payload.bio);
                }
                if (payload.position) fd.append("position", payload.position);
                if (payload.slug) fd.append("slug", payload.slug);

                // Files: use the field name your server expects: 'image'
                if (
                    payload.profileImage &&
                    payload.profileImage instanceof File
                ) {
                    fd.append("image", payload.profileImage);
                }

                res = await fetch(url, {
                    method: "POST",
                    body: fd,
                    credentials: "include",
                });
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

    fetchProfiles: async () => {
        try {
            set({ loading: true });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/profile/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            const { data } = await res.json();
            set({ profilesData: data, loading: false });

            console.log("Fetched profiles:", data);
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },

    getProfileById: async (id) => {
        try {
        } catch (error) {}
    },

    deleteProfile: async (id) => {
        try {
        } catch (error) {}
    },

    updateProfile: async (id, payload) => {
        try {
        } catch (error) {}
    },
}));

export { useProfileStore };
