"use client";

import * as React from "react";
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
            url: "#",
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
            name: "Verify User",
            url: "#",
            icon: IconDatabase,
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
