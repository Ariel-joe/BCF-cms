import { model, Schema } from "mongoose";
import { Role } from "./role.js";

const userSchema = new Schema(
    {
        googleId: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        role: {
            type: String,
            required: true,
            ref: "Role", // Reference to role slug
        },
        isActive: { type: Boolean, default: true, required: true },
    },
    {
        timestamps: true,
    }
);

// Populate role permissions when querying user
userSchema.methods.getPermissions = async function () {
    const role = await Role.findOne({ slug: this.role });
    return role ? role.permissions : [];
};

const User = model("User", userSchema);
export { User };
