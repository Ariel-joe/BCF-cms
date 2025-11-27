// / scripts/seedRoles.js
import { ROLE_PERMISSIONS } from "./permissions.js";
import { Role } from "../database/role.js";
import { User } from "../database/user.js";

export const seedRoles = async () => {
    try {
        console.log("Seeding roles...");

        for (const [key, roleData] of Object.entries(ROLE_PERMISSIONS)) {
            const exists = await Role.findOne({ slug: roleData.slug });

            if (!exists) {
                await Role.create({
                    slug: roleData.slug,
                    displayName: roleData.displayName,
                    permissions: roleData.permissions,
                    isSystemRole: roleData.isSystemRole,
                });
                console.log(`✓ Created role: ${roleData.displayName}`);
            } else {
                // Update permissions for existing roles
                await Role.updateOne(
                    { slug: roleData.slug },
                    {
                        permissions: roleData.permissions,
                        displayName: roleData.displayName,
                    }
                );
                console.log(`✓ Updated role: ${roleData.displayName}`);
            }
        }

        console.log("Roles seeded successfully!");
    } catch (error) {
        console.error("Error seeding roles:", error);
        throw error;
    }
};

export const updateUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        user.lastLogin = new Date();
        await user.save();

        console.log(`✓ Updated lastLogin for user: ${user.email}`);
    } catch (error) {
        
    }
}
