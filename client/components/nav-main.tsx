"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon;
    }[];
}) {
    const pathname = usePathname() || "/";
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild
                                tooltip={item.title}
                                isActive={isActive}
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
