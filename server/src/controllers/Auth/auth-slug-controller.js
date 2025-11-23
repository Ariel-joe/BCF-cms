import { StatusCodes } from "http-status-codes";
import { AuthSlug } from "../../database/authSlug.js";


// new slug sign up
export const createSlug = async (req, res) => {
    try {
        const { name, slug, description, permissions } = req.body;

        const slugData = {
            name,
            slug,
            description,
            permissions: permissions.map((item) => item),
            isSystemRole: false,
        };
        const newSlug = await AuthSlug.create(slugData);

        if (!newSlug) throw new Error("try again!");

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "authorization type added successfully",
        });
    } catch (error) {
        console.error(error.message);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "please try again",
        });
    }
};


// fetch all slugs
export const viewAllSlugs = async (req, res) => {
    try {
        const slugs = await AuthSlug.find();

        const resData = slugs.map((item) => ({
            name: item.name,
            description: item.description,
            permissions: item.permissions,
        }));

        res.status(StatusCodes.ACCEPTED).json({
            success: true,
            data: resData,
        });
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: true,
            message: "unable to fetch the slugs"
        })
        
    }
};
