import { model, Schema } from "mongoose";

const authSlugSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            // e.g., "Finance Director"
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // e.g., 1824 for "finance_director" - immutable identifier for code checks
        },

        description: {
            type: String,
            trim: true,
        },

        // The specific capabilities this role has.
        // Instead of checking "Is this user an admin?", you check "Does this user have 'view_financials'?"
        permissions: [
            {
                type: String,
                trim: true,
            },
        ],

        isSystemRole: {
            type: Boolean,
            default: false,
            immutable: true,
            // If true, this role cannot be deleted (prevents locking out the 'developer' or 'admin')
        },
    },
    {
        timestamps: true,
    }
);

const AuthSlug = model("authSlug", authSlugSchema);

export { AuthSlug };
