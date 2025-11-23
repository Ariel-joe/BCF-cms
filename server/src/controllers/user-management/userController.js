import { User } from "../../database/user";

export const listUsers = async (req, res) => {
    try {
        const user = req.user.id
        if(!user) throw new Error("unauthorized");
        
        // TODO: update to make the logic for role access auth.
        const users = await User.find()

        
    } catch (error) {
        
    }
}