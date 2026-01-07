"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Activity,
  BriefcaseBusiness,
  Key,
  LayoutGrid,
  Users
} from "lucide-react";

import { HeaderLogo } from "@/components/icons";
import Link from "next/link";
import { NavMain } from "./Nabmain";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard/admin/overview",
      Icon: LayoutGrid,
      show: true,
    },
    {
      title: "Category",
      Icon: Users,
      url: "/dashboard/admin/category",
      show: true,
    },
    {
      title: "Partners",
      Icon: BriefcaseBusiness,
      url: "/dashboard/admin/partners",
      show: true,
    },
    {
      title: "Members",
      Icon: Users,
      url: "/dashboard/admin/members",
      show: true,
    },
    {
      title: "Activities",
      Icon: Activity,
      url: "/dashboard/admin/activities",
      show: true,
    },
    {
      title: "Access Codes",
      Icon: Key,
      url: "/dashboard/admin/access-code",
      show: true,
    },
  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-black text-white"
    >
      <SidebarHeader className="bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild
              className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
            >
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">
                  <Link href={"/"}><HeaderLogo /></Link>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-2 bg-black text-white">
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="bg-black" />
    </Sidebar>
  );
}
