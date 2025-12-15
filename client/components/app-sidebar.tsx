"use client";

import * as React from "react";
import {
    IconChartBar,
    IconDatabase,
    IconListDetails,
    IconUserCircle,
    IconFiles,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useAuthStore } from "@/stores/authstore";

/* ------------------------------------------------------
   Permission helper
------------------------------------------------------ */
const hasPermission = (
    permissions: string[] = [],
    required: string | string[]
) => {
    if (!permissions?.length) return false;

    if (Array.isArray(required)) {
        return required.some((p) => permissions.includes(p));
    }

    return permissions.includes(required);
};

/* ------------------------------------------------------
   Sidebar data (UNCHANGED)
------------------------------------------------------ */
const data = {
    navMain: [
        {
            title: "Donations",
            url: "/donations",
            icon: IconChartBar,
        },
        {
            title: "Contact Form Submissions",
            url: "/form",
            icon: IconFiles,
        },
    ],

    blogSection: [
        {
            name: "Publish Blog & Update",
            url: "/blog/create",
            icon: IconListDetails,
        },
        {
            name: "Blogs",
            url: "/blog",
            icon: IconDatabase,
        },
    ],

    welfareSection: [
        {
            name: "Publish Welfare Updates",
            url: "/welfare/create",
            icon: IconListDetails,
        },
        {
            name: "Welfares",
            url: "/welfare",
            icon: IconDatabase,
        },
    ],

    profileSection: [
        {
            name: "Profile List",
            url: "/profile",
            icon: IconListDetails,
        },
        {
            name: "Create Profile",
            url: "/profile/create",
            icon: IconUserCircle,
        },
    ],

    userSection: [
        {
            name: "Accounts List",
            url: "/account",
            icon: IconListDetails,
        },
        {
            name: "Create Account",
            url: "/account/create",
            icon: IconUserCircle,
        },
    ],
};

/* ------------------------------------------------------
   Sidebar component
------------------------------------------------------ */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useAuthStore((state) => state.user);
    const permissions = user?.permissions || [];

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <Link href="/donations">
                    <img
                        src="/bcf-logo-nobg.png"
                        width={200}
                        height={100}
                        alt="BCF Logo"
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent>
                {/* Main navigation */}
                <NavMain items={data.navMain} />

                {/* Blogs */}
                {hasPermission(permissions, ["blog:read", "blog:create"]) && (
                    <NavDocuments
                        title="Blogs"
                        items={data.blogSection.filter((item) => {
                            if (item.url === "/blog/create") {
                                return hasPermission(
                                    permissions,
                                    "blog:create"
                                );
                            }
                            if (item.url === "/blog") {
                                return hasPermission(
                                    permissions,
                                    "blog:read"
                                );
                            }
                            return false;
                        })}
                    />
                )}

                {/* Welfares */}
                {hasPermission(
                    permissions,
                    ["welfare:read", "welfare:create"]
                ) && (
                    <NavDocuments
                        title="Welfares"
                        items={data.welfareSection.filter((item) => {
                            if (item.url === "/welfare/create") {
                                return hasPermission(
                                    permissions,
                                    "welfare:create"
                                );
                            }
                            if (item.url === "/welfare") {
                                return hasPermission(
                                    permissions,
                                    "welfare:read"
                                );
                            }
                            return false;
                        })}
                    />
                )}

                {/* Profiles */}
                {hasPermission(
                    permissions,
                    ["profile:read", "profile:create"]
                ) && (
                    <NavDocuments
                        title="Profiles"
                        items={data.profileSection.filter((item) => {
                            if (item.url === "/profile/create") {
                                return hasPermission(
                                    permissions,
                                    "profile:create"
                                );
                            }
                            if (item.url === "/profile") {
                                return hasPermission(
                                    permissions,
                                    "profile:read"
                                );
                            }
                            return false;
                        })}
                    />
                )}

                {/* Users (President / Admin level) */}
                {hasPermission(permissions, ["user:read", "user:create"]) && (
                    <NavDocuments
                        title="Users"
                        items={data.userSection.filter((item) => {
                            if (item.url === "/account/create") {
                                return hasPermission(
                                    permissions,
                                    "user:create"
                                );
                            }
                            if (item.url === "/account") {
                                return hasPermission(
                                    permissions,
                                    "user:read"
                                );
                            }
                            return false;
                        })}
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
