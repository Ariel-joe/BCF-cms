import { StatusCodes } from "http-status-codes";
import { User } from "../../database/user.js";
import { Welfare } from "../../database/welfare.js";
import { uploadImageToCloudinary } from "../../middleware/multerImage.js";

export const createWelfare = async (req, res) => {
    try {
        const { title, startDate, category, status, summary } = req.body;

        const userId = req.user.id;

        console.log("attempting to create welfare...");

        // Validate user
        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Process image using Cloudinary
        const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
        const imageUrl = uploadedImage.secure_url;

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

        // Parse impactRecord from JSON string (sent from frontend)
        let impactRecord = { individuals: "0", communities: "0" };
        if (req.body.impactRecord) {
            try {
                impactRecord = JSON.parse(req.body.impactRecord);
            } catch (error) {
                console.log("Could not parse impactRecord, using defaults");
            }
        }

        console.log("processing content including impact record...");

        // Parse partners array - it comes as partners[] from FormData
        const partners = req.body.partners || [];
        const partnersArray = Array.isArray(partners) ? partners : [partners];

        console.log("this is the coordinator id:", loggedInUser._id);

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
            impactRecord: impactRecord,
        };

        const newWelfare = await Welfare.create(welfareData);

        if (!newWelfare) {
            throw new Error("Cannot create welfare project");
        }

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

// fetchall welfare intiatives
export const getAllWelfares = async (req, res) => {
    try {
        const welfares = await Welfare.find().populate(
            "coordinator",
            "name email"
        );
        return res.status(StatusCodes.OK).json({
            success: true,
            data: welfares,
        });
    } catch (error) {
        console.error("Fetch all welfares error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};
// Update welfare by id (including updating image)
export const updateWelfareById = async (req, res) => {
    try {
        const welfareId = req.params.id;

        // Validate user
        const userId = req.user?.id;
        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Fetch existing welfare to merge updates
        const existing = await Welfare.findById(welfareId);
        if (!existing) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Welfare project not found",
            });
        }

        // ✅ Handle image upload - use req.file.path (not buffer)
        let imageUrl = existing.image; // Keep existing image by default
        if (req.file) {
            // Process image using Cloudinary
            const uploadedImage = await uploadImageToCloudinary(
                req.file.buffer
            );
            imageUrl = uploadedImage.secure_url;

            // If you're using memory storage and need to upload to Cloudinary manually:
            // const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
            // imageUrl = uploadedImage.secure_url;
        }

        // Parse content if provided (it may be a JSON string)
        let content = existing.content;
        if (req.body.content !== undefined) {
            try {
                content = req.body.content
                    ? JSON.parse(req.body.content)
                    : existing.content;
            } catch (error) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid content format",
                });
            }
        }

        // Normalize partners (may come as partners[] from FormData)
        let partnersArray = existing.partners || [];
        if (req.body.partners !== undefined) {
            const partners = req.body.partners || [];
            partnersArray = Array.isArray(partners) ? partners : [partners];
            partnersArray = partnersArray.filter((p) => String(p).trim());
        }

        // Build update payload only with fields provided (leave others intact)
        const {
            title,
            startDate,
            category,
            status,
            summary,
            progress,
            budget,
            successRate,
            impactIndividuals,
            impactCommunities,
        } = req.body;

        const updateData = {};
        if (imageUrl !== existing.image) updateData.image = imageUrl; // ✅ Only update if changed
        if (title !== undefined) updateData.title = title;
        if (startDate !== undefined)
            updateData.startDate = startDate
                ? new Date(startDate)
                : existing.startDate;
        if (category !== undefined) updateData.category = category;
        if (status !== undefined) updateData.status = status;
        if (summary !== undefined) updateData.summary = summary;
        if (content !== undefined) updateData.content = content;
        if (partnersArray.length > 0) updateData.partners = partnersArray; // ✅ Fixed condition
        if (progress !== undefined) updateData.progress = progress;
        if (budget !== undefined) updateData.budget = budget;
        if (successRate !== undefined) updateData.successRate = successRate;

        // impactRecord merge
        updateData.impactRecord = {
            individuals:
                impactIndividuals !== undefined
                    ? impactIndividuals
                    : existing.impactRecord?.individuals || "0",
            communities:
                impactCommunities !== undefined
                    ? impactCommunities
                    : existing.impactRecord?.communities || "0",
        };

        // Do the update
        const updatedWelfare = await Welfare.findByIdAndUpdate(
            welfareId,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Welfare project updated successfully",
            data: updatedWelfare,
        });
    } catch (error) {
        console.error("Welfare update error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// fetch welfare by id
export const getWelfareById = async (req, res) => {
    try {
        const welfareId = req.params.id;
        const welfare = await Welfare.findById(welfareId).populate(
            "coordinator",
            "name email"
        );
        if (!welfare) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Welfare project not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: welfare,
        });
    } catch (error) {
        console.error("Fetch welfare by ID error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// delete welfare by id
export const deleteWelfareById = async (req, res) => {
    try {
        const welfareId = req.params.id;
        const deletedWelfare = await Welfare.findByIdAndDelete(welfareId);
        if (!deletedWelfare) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Welfare project not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Welfare project deleted successfully",
        });
    } catch (error) {
        console.error("Delete welfare error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};
