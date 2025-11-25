import { StatusCodes } from "http-status-codes";
import { BioData } from "../../database/profile.js";
import { User } from "../../database/user.js";

// creating profile
export const createProfile = async (req, res) => {
    try {
        const user = req.user.id;

        const loggedInUser = await User.findById(user);
        if (!loggedInUser) throw new Error("Unauthorized");

        const { name, position, slug, bio } = req.body;

        // Process image
        const imageUrl = req.file?.path || null;

        if (!imageUrl) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Featured image is required",
            });
        }

        const profileData = {
            image: imageUrl,
            name,
            position,
            slug,
            bio,
        };

        const newProfile = await BioData.create(profileData);

        if (!newProfile) throw new Error("Cannot create profile");

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Profile created successfully",
            data: newProfile,
        });
    } catch (error) {
        console.error("Profile creation error:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// fetching all profiles
export const fetchAllProfiles = async (req, res) => {
    try {
        const profiles = await BioData.find();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: profiles,
        });
    } catch (error) {
        console.error("Fetch all profiles error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// fetch profile by Id
export const getProfileById = async (req, res) => {
    try {
        const profileId = req.params.id;

        const profile = await BioData.findById(profileId);
        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Profile not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error("Get profile by ID error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// update profile by id
export const updateProfileById = async (req, res) => {
    try {
        const profileId = req.params.id;
        const userId = req.user?.id;

        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const existingProfile = await BioData.findById(profileId);
        if (!existingProfile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Profile not found",
            });
        }
        const updatedData = {
            image: req.file?.path || existingProfile.image,
            name: req.body.name || existingProfile.name,
            position: req.body.position || existingProfile.position,
            slug: req.body.slug || existingProfile.slug,
            bio: req.body.bio || existingProfile.bio,
        };
        const updatedProfile = await BioData.findByIdAndUpdate(
            profileId,
            updatedData,
            { new: true }
        );

        if (!updatedProfile) throw new Error("Profile unable to update!");

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// delete profile by Id
export const deleteProfileById = async (req, res) => {
    try {
        const profileId = req.params.id;
        const userId = req.user?.id;
        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const existingProfile = await BioData.findById(profileId);
        if (!existingProfile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Profile not found",
            });
        }
        await BioData.findByIdAndDelete(profileId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Profile deleted successfully",
        });
    } catch (error) {
        console.error("Profile deletion error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};
