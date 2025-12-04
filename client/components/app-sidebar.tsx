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
    IconShieldLock,
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
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserLock } from "lucide-react";
import Link from "next/link";

const data = {
    navMain: [
        // {
        //     title: "Dashboard",
        //     url: "/dashboard",
        //     icon: IconDashboard,
        // },

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <Link href="/donations">
                    <img
                        src={"/bcf-logo-nobg.png"}
                        width={200}
                        height={100}
                        alt="BCF Logo"
                    />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments title="Blogs" items={data.blogSection} />
                <NavDocuments title="Welfares" items={data.welfareSection} />
                <NavDocuments title="Profiles" items={data.profileSection} />
                <NavDocuments title="Users" items={data.userSection} />
                {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
