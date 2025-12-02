"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ReactNode } from "react";
import avatar from "@/assets/dashboard/header/avatar.png";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { AppSidebar } from "@/components/Shared/dashboard/sidebar/AppSidebar";
import useScrollTrigger from "@/hooks/useScrollTrigger";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { scrolled } = useScrollTrigger();
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <header
            className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-primary-200 z-10 shadow-sm bg-white ${
              scrolled && "shadow-md"
            }`}
          >
            <div className="flex items-center justify-between gap-2 px-4 w-full">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-black" />
                <h1 className="text-lg xs:text-xl md:text-2xl font-semibold text-[#0D1B2A]">
                  Super Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4 mr-2">
                <MdOutlineNotificationsNone className="text-xl" />
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatar.src} alt="Sarah Johnson" />
                  <AvatarFallback className="bg-gray-700 text-white">
                    SJ
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <div className="bg-[#F9FAFB] min-h-[calc(100vh)] z-0">
            <div className="p-5">{children}</div>
          </div>
          {/* <footer className="w-full px-4 py-6 bg-primary-200 text-sm text-white text-center">
            Carbon Engines Admin — Precision in Every Rep, Control in Every
            Detail.
          </footer> */}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
