import { StatusCodes } from "http-status-codes";
import { User } from "../../database/user.js";
import { Welfare } from "../../database/welfare.js";

export const createWelfare = async (req, res) => {
    try {
        const { title, startDate, category, status, summary } = req.body;

        const userId = req.user.id;

        // Validate user
        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Process image
        const imageUrl = req.file?.path || null;

        if (!imageUrl) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Featured image is required",
            });
        }

        // Parse content from JSON string
        let content;
        try {
            content = JSON.parse(req.body.content);
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid content format",
            });
        }

        // Parse partners array - it comes as partners[] from FormData
        const partners = req.body.partners || [];
        const partnersArray = Array.isArray(partners) ? partners : [partners];

        // Create welfare data
        const welfareData = {
            image: imageUrl,
            title,
            startDate: new Date(startDate),
            category,
            status,
            summary,
            content: content,
            partners: partnersArray.filter((p) => p.trim()), // Remove empty strings
            coordinator: loggedInUser._id,
            // Optional fields with defaults
            progress: req.body.progress || "0%",
            budget: req.body.budget || "N/A",
            successRate: req.body.successRate || "0%",
            impactRecord: {
                individuals: req.body.impactIndividuals || "0",
                communities: req.body.impactCommunities || "0",
            },
        };

        const newWelfare = await Welfare.create(welfareData);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Welfare project created successfully",
            data: newWelfare,
        });
    } catch (error) {
        console.error("Welfare creation error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};
