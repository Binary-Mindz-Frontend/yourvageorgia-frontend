"use client";
import { AppSidebar } from "@/components/Shared/dashboard/sidebar/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import useScrollTrigger from "@/hooks/useScrollTrigger";
import { logout } from "@/services/auth";
import { LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { scrolled } = useScrollTrigger();
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    setShowLogout(false);
    router.push("/dashboard/admin/login");
    router.refresh();
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };

    if (showLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogout]);

  // If on login page, show only the children (login form) without layout
  if (pathname === "/dashboard/admin/login") {
    return <>{children}</>;
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <header
            className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-primary-200 z-10 shadow-sm bg-black ${scrolled && "shadow-md"
              }`}
          >
            <div className="flex items-center justify-between gap-2 px-4 w-full">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-white" />
                <h1 className="text-lg xs:text-xl md:text-2xl font-semibold text-white">
                  Super Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4 mr-2">

                <div className="relative" ref={dropdownRef}>
                  <Avatar
                    className="h-10 w-10 cursor-pointer"
                    onClick={toggleLogout}
                  >
                    <AvatarFallback className="bg-gray-700 text-white">
                      <User />
                    </AvatarFallback>
                  </Avatar>

                  {showLogout && (
                    <div className="absolute right-0 top-11 bg-black border border-gray-700 rounded-md shadow-lg min-w-40 z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="bg-black min-h-[calc(100vh)] z-0">
            <div className="">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
export default DashboardLayout;
