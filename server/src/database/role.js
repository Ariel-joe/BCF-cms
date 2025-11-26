import { model, Schema } from "mongoose";

const roleSchema = new Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        permissions: [
            {
                type: String,
                trim: true,
                required: true,
            },
        ],
        isSystemRole: {
            type: Boolean,
            default: false,
            immutable: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent deletion of system roles
roleSchema.pre("remove", function (next) {
    if (this.isSystemRole) {
        next(new Error("Cannot delete system role"));
    } else {
        next();
    }
});

const Role = model("Role", roleSchema);
export { Role };
