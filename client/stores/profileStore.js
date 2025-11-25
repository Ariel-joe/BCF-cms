const { create } = require("zustand");

const useProfileStore = create((set) => ({
    profile: null,
    loading: false,

    createProfile: async(payload) => {
        try {
            
        } catch (error) {
            
        }
    },

    fetchProfiles: async() => {
        try {
            
        } catch (error) {
            
        }
    },

    getProfileById: async(id) => {
        try {
            
        } catch (error) {
            
        }
    },

    deleteProfile: async(id) => {
        try {
            
        } catch (error) {
            
        }
    },

    updateProfile: async(id, payload) => {
        try {
            
        } catch (error) {
            
        }
    }
}));

export { useProfileStore };