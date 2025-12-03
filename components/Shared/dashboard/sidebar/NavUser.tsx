"use client";

import dp from "@/assets/dashboard/header/avatar.png";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu className="rounded-2xl ">
      <SidebarMenuItem className="bg-[#0B1A2A] py-1 focus:ring-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-2xl focus:outline-none"
            asChild
          >
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              {/* Avatar only */}
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={dp.src} alt="DP" />
                <AvatarFallback className="rounded-lg">DP</AvatarFallback>
              </Avatar>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* Dropdown */}
          <DropdownMenuContent
            className="min-w-40 bg-primary-200 border border-secondary font-medium"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuSeparator className="border border-secondary" />

            {/* LOGOUT ONLY */}
            <button
              // onClick={handleLogout}
              className="cursor-pointer bg-secondary flex items-center gap-2 w-full py-2 px-3 text-red-600 hover:text-red-500 hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
