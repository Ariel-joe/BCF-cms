import { StatusCodes } from "http-status-codes";
import { User } from "../../database/user.js";

// admin to see a list of user accounts
export const listAccounts = async (req, res) => {
    try {
        const user = req.user.id;
        if (!user) throw new Error("unauthorized");

        // TODO: update to make the logic for role access auth.
        const users = await User.find();

        const resData = users.map((u) => ({
            id: u._id,
            email: u.email,
            name: u.name,
            role: u.role,
            isActive: u.isActive,
            lastLogin: u.lastLogin,
        }));

        res.status(StatusCodes.OK).json({ success: true, data: resData });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// admin can see the profile of a user account
export const getUserProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const userId = req.user?.id;

        if (!userId) throw new Error("unauthorized");
        const account = await User.findById(profileId);
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "account not found",
            });
        }
        const resData = {
            id: account._id,
            email: account.email,
            name: account.name,
            role: account.role,
            isActive: account.isActive,
            lastLogin: account.lastLogin,
        };

        res.status(StatusCodes.OK).json({
            success: true,
            data: resData,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// admin update the users email or name or role, the update can be any of the 3
export const updateUserDetails = async (req, res) => {
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
        const existingUser = await User.findById(profileId);
        if (!existingUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "user not found",
            });
        }
        const updatedData = {
            name: req.body.name || existingUser.name,
            email: req.body.email || existingUser.email,
            role: req.body.role || existingUser.role,
        };
        const updatedUser = await User.findByIdAndUpdate(
            profileId,
            updatedData,
            { new: true }
        );

        if (!updatedUser) throw new Error("Profile unable to update!");

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// admin can activate a user account
export const activateUser = async (req, res) => {
    try {
        const profileId = req.params.id;
        const userId = req.user?.id;
        if (!userId) throw new Error("unauthorized");

        const account = await User.findById(profileId);
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "account not found",
            });
        }
        account.isActive = true;
        await account.save();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "account activated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// admin can deactivate a user account
export const deactivateUser = async (req, res) => {
    try {
        const profileId = req.params.id;
        const userId = req.user?.id;
        if (!userId) throw new Error("unauthorized");

        const account = await User.findById(profileId);
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "account not found",
            });
        }
        account.isActive = false;
        await account.save();

        res.status(StatusCodes.OK).json({
            success: true,
            data: account,
            message: "account deactivated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// admin can delete a user account
export const deleteUser = async (req, res) => {
    try {
        const profileId = req.params.id;
        const userId = req.user?.id;
        if (!userId) throw new Error("unauthorized");

        const account = await User.findById(profileId);
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "account not found",
            });
        }
        await account.remove();

        res.status(StatusCodes.OK).json({
            success: true,
            message: "account deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
