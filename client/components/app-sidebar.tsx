"use client";

import * as React from "react";
import {
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconSearch,
    IconSettings,
    IconUserCircle,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserLock } from "lucide-react";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },

        {
            title: "Donations",
            url: "#",
            icon: IconChartBar,
        },
        {
            title: "User Directory",
            url: "#",
            icon: IconDatabase,
        },
    ],

    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
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
        // {
        //     name: "Drafts",
        //     url: "#",
        //     icon: IconReport,
        // },
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
        // {
        //     name: "Drafts",
        //     url: "#",
        //     icon: IconReport,
        // },
    ],
    userSection: [
        {
            name: "Users List",
            url: "#",
            icon: IconListDetails,
        },
        {
            name: "Create Account",
            url: "#",
            icon: IconUserCircle,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">
                                    BCF Portal
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments title="Blog" items={data.blogSection} />
                <NavDocuments title="Welfare" items={data.welfareSection} />
                <NavDocuments title="Users" items={data.userSection} />
                {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
