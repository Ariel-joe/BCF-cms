// permissions for the roles
const PERMISSIONS = {
    // Blog Management
    BLOG_CREATE: "blog:create",
    BLOG_READ: "blog:read",
    BLOG_UPDATE: "blog:update",
    BLOG_DELETE: "blog:delete",

    // Welfare Management
    WELFARE_CREATE: "welfare:create",
    WELFARE_READ: "welfare:read",
    WELFARE_UPDATE: "welfare:update",
    WELFARE_DELETE: "welfare:delete",

    // User Management
    USER_CREATE: "user:create",
    USER_READ: "user:read",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete",

    // Profile Management (Our Team)
    PROFILE_CREATE: "profile:create",
    PROFILE_READ: "profile:read",
    PROFILE_UPDATE: "profile:update",
    PROFILE_DELETE: "profile:delete",

    // Finance/Donations (Read-only)
    FINANCE_READ: "finance:read",

    // Contact Form (Read-only)
    CONTACT_READ: "contact:read",
};
// role permissions
export const ROLE_PERMISSIONS = {
    president: {
        slug: "president",
        displayName: "President",
        permissions: [
            // Full access to everything
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_UPDATE,
            PERMISSIONS.BLOG_DELETE,
            PERMISSIONS.WELFARE_CREATE,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.WELFARE_UPDATE,
            PERMISSIONS.WELFARE_DELETE,
            PERMISSIONS.USER_CREATE,
            PERMISSIONS.USER_READ,
            PERMISSIONS.USER_UPDATE,
            PERMISSIONS.USER_DELETE,
            PERMISSIONS.PROFILE_CREATE,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.PROFILE_UPDATE,
            PERMISSIONS.PROFILE_DELETE,
            PERMISSIONS.FINANCE_READ,
            PERMISSIONS.CONTACT_READ,
        ],
        isSystemRole: true,
    },

    "vice-president": {
        slug: "vice-president",
        displayName: "Vice President",
        permissions: [
            // Almost full access, except user deletion
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_UPDATE,
            PERMISSIONS.BLOG_DELETE,
            PERMISSIONS.WELFARE_CREATE,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.WELFARE_UPDATE,
            PERMISSIONS.WELFARE_DELETE,
            PERMISSIONS.USER_CREATE,
            PERMISSIONS.USER_READ,
            PERMISSIONS.USER_UPDATE,
            PERMISSIONS.PROFILE_CREATE,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.PROFILE_UPDATE,
            PERMISSIONS.PROFILE_DELETE,
            PERMISSIONS.FINANCE_READ,
            PERMISSIONS.CONTACT_READ,
        ],
        isSystemRole: true,
    },

    "finance-director": {
        slug: "finance-director",
        displayName: "Finance Director",
        permissions: [
            // Finance focus with read access to other areas
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.FINANCE_READ,
            PERMISSIONS.CONTACT_READ,
            PERMISSIONS.USER_READ,
        ],
        isSystemRole: true,
    },

    secretary: {
        slug: "secretary",
        displayName: "Secretary",
        permissions: [
            // Documentation and communication focus
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_UPDATE,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.CONTACT_READ,
            PERMISSIONS.USER_READ,
        ],
        isSystemRole: true,
    },

    "vice-secretary": {
        slug: "vice-secretary",
        displayName: "Vice Secretary",
        permissions: [
            // Similar to secretary but less permissions
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_UPDATE,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.CONTACT_READ,
        ],
        isSystemRole: true,
    },

    "welfare-director": {
        slug: "welfare-director",
        displayName: "Welfare Director",
        permissions: [
            // Full welfare management
            PERMISSIONS.WELFARE_CREATE,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.WELFARE_UPDATE,
            PERMISSIONS.WELFARE_DELETE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.FINANCE_READ,
            PERMISSIONS.CONTACT_READ,
        ],
        isSystemRole: true,
    },

    "head-of-communications": {
        slug: "head-of-communications",
        displayName: "Head of Communications",
        permissions: [
            // Full blog and profile management
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_UPDATE,
            PERMISSIONS.BLOG_DELETE,
            PERMISSIONS.PROFILE_CREATE,
            PERMISSIONS.PROFILE_READ,
            PERMISSIONS.PROFILE_UPDATE,
            PERMISSIONS.PROFILE_DELETE,
            PERMISSIONS.WELFARE_READ,
            PERMISSIONS.CONTACT_READ,
        ],
        isSystemRole: true,
    },
};
