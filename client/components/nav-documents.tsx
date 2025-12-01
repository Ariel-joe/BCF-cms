"use client";

import { type Icon } from "@tabler/icons-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavDocuments({
    items,
    title,
}: {
    title: string;
    items: {
        name: string;
        url: string;
        icon: Icon;
    }[];
}) {

    const pathname = usePathname() || "/";

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
            {items.map((item) => {
          // Use startsWith for "parent route" matching, or === for exact match.
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
