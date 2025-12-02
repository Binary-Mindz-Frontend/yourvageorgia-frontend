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

import Link from "next/link";
import Image from "next/image";
import {
  BriefcaseBusiness,
  LayoutGrid,
  Users,
} from "lucide-react";
import logo from "@/public/assets/profile/profile.jpg";
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
            <SidebarMenuButton size="lg" asChild>
              <div className="mt-2">
                <div className="text-2xl font-bold text-white">
                  <Link href="/">
                    <Image
                      src={logo}
                      alt="logo"
                      width={150}
                      height={40}
                      className="w-25 h-25"
                    />
                  </Link>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-2 bg-black text-white">
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="bg-black" />
    </Sidebar>
  );
}
