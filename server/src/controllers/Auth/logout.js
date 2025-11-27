import { StatusCodes } from "http-status-codes";

export const logout = async (req, res) => {
    try {
        // Clear the authentication token cookie
        res.clearCookie(process.env.AUTH_COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An internal server error occurred",
        });
    }
};