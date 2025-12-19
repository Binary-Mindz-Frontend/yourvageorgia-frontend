// // "use client";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import {
// //   SidebarInset,
// //   SidebarProvider,
// //   SidebarTrigger,
// // } from "@/components/ui/sidebar";
// // import { ReactNode, useState, useEffect, useRef } from "react";
// // import avatar from "@/public/assets/dashboard/header/avatar.png";
// // import { MdOutlineNotificationsNone } from "react-icons/md";
// // import { AppSidebar } from "@/components/Shared/dashboard/sidebar/AppSidebar";
// // import useScrollTrigger from "@/hooks/useScrollTrigger";
// // import { LogOut } from "lucide-react";
// // import { Toaster } from "sonner";


// // const DashboardLayout = ({ children }: { children: ReactNode }) => {
// //   const { scrolled } = useScrollTrigger();
// //   const [showLogout, setShowLogout] = useState(false);
// //   const dropdownRef = useRef<HTMLDivElement>(null);

// //   const handleLogout = () => {
// //     // Add your logout logic here
// //     console.log("Logging out...");
// //     // Example: router.push('/login');
// //     // Example: signOut();
// //   };

// //   const toggleLogout = () => {
// //     setShowLogout(!showLogout);
// //   };

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
// //         setShowLogout(false);
// //       }
// //     };

// //     if (showLogout) {
// //       document.addEventListener("mousedown", handleClickOutside);
// //     }

// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, [showLogout]);

// //   return (
// //     <div>
// //       <SidebarProvider>
// //         <AppSidebar />
// //         <SidebarInset className="">
// //           <header
// //             className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-primary-200 z-10 shadow-sm bg-black ${
// //               scrolled && "shadow-md"
// //             }`}
// //           >
// //             <div className="flex items-center justify-between gap-2 px-4 w-full">
// //               <div className="flex items-center gap-2">
// //                 <SidebarTrigger className="-ml-1 text-white" />
// //                 <h1 className="text-lg xs:text-xl md:text-2xl font-semibold text-white">
// //                   Super Admin Dashboard
// //                 </h1>
// //               </div>
// //               <div className="flex items-center gap-4 mr-2">
// //                 <MdOutlineNotificationsNone className="text-xl text-white" />
// //                 <div className="relative" ref={dropdownRef}>
// //                   <Avatar 
// //                     className="h-10 w-10 cursor-pointer" 
// //                     onClick={toggleLogout}
// //                   >
// //                     <AvatarImage src={avatar.src} alt="Solenne" />
// //                     <AvatarFallback className="bg-gray-700 text-white">
// //                       SJ
// //                     </AvatarFallback>
// //                   </Avatar>
                  
// //                   {showLogout && (
// //                     <div className="absolute right-0 top-11 bg-black border border-gray-700 rounded-md shadow-lg min-w-40 z-50">
// //                       <button
// //                         onClick={handleLogout}
// //                         className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2 transition-colors"
// //                       >
// //                         <LogOut className="h-4 w-4" />
// //                         Logout
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </header>
// //           <div className="bg-black min-h-[calc(100vh)] z-0">
// //             <div className="">{children}</div>
// //             <Toaster position="top-right" />
// //           </div>
// //           {/* <footer className="w-full px-4 py-6 bg-primary-200 text-sm text-white text-center">
// //             Carbon Engines Admin — Precision in Every Rep, Control in Every
// //             Detail.
// //           </footer> */}
// //         </SidebarInset>
// //       </SidebarProvider>
// //     </div>
// //   );
// // };
// // export default DashboardLayout;

// "use client";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { ReactNode, useState, useEffect, useRef } from "react";
// import { MdOutlineNotificationsNone } from "react-icons/md";
// import { AppSidebar } from "@/components/Shared/dashboard/sidebar/AppSidebar";
// import useScrollTrigger from "@/hooks/useScrollTrigger";
// import { LogOut, User } from "lucide-react";
// import { Toaster } from "sonner";
// import { useRouter, usePathname } from "next/navigation";

// import { toast } from "sonner";
// import { isAdminAuthenticated, logoutAdmin } from "@/services/admin.auth/admin.auth";

// const DashboardLayout = ({ children }: { children: ReactNode }) => {
//   const { scrolled } = useScrollTrigger();
//   const [showLogout, setShowLogout] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const pathname = usePathname();

//   // Check authentication on mount
//   useEffect(() => {
//     const checkAuth = () => {
//       // Skip auth check for login page
//       if (pathname === "/dashboard/admin/login") {
//         setIsChecking(false);
//         return;
//       }

//       // Check if user is authenticated
//       if (!isAdminAuthenticated()) {
//         router.push("/dashboard/admin/login");
//       } else {
//         setIsChecking(false);
//       }
//     };

//     checkAuth();
//   }, [router, pathname]);

//   const handleLogout = () => {
//     logoutAdmin();
//     toast.success("Logged out successfully!");
//     setShowLogout(false);
//     router.push("/dashboard/admin/login");
//     router.refresh();
//   };

//   const toggleLogout = () => {
//     setShowLogout(!showLogout);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowLogout(false);
//       }
//     };

//     if (showLogout) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showLogout]);

//   // If on login page, show only the children (login form) without layout
//   if (pathname === "/dashboard/admin/login") {
//     return <>{children}</>;
//   }

//   // Show loading while checking auth
//   if (isChecking) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black">
//         <p className="text-white text-xl">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <SidebarProvider>
//         <AppSidebar />
//         <SidebarInset className="">
//           <header
//             className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-primary-200 z-10 shadow-sm bg-black ${
//               scrolled && "shadow-md"
//             }`}
//           >
//             <div className="flex items-center justify-between gap-2 px-4 w-full">
//               <div className="flex items-center gap-2">
//                 <SidebarTrigger className="-ml-1 text-white" />
//                 <h1 className="text-lg xs:text-xl md:text-2xl font-semibold text-white">
//                   Super Admin Dashboard
//                 </h1>
//               </div>
//               <div className="flex items-center gap-4 mr-2">
//                 <MdOutlineNotificationsNone className="text-xl text-white" />
//                 <div className="relative" ref={dropdownRef}>
//                   <Avatar 
//                     className="h-10 w-10 cursor-pointer" 
//                     onClick={toggleLogout}
//                   >
//                     {/* <AvatarImage src={avatar.src} alt="Solenne" /> */}
//                     <AvatarFallback className="bg-gray-700 text-white">
//                       <User />
//                     </AvatarFallback>
//                   </Avatar>
                  
//                   {showLogout && (
//                     <div className="absolute right-0 top-11 bg-black border border-gray-700 rounded-md shadow-lg min-w-40 z-50">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-800 flex items-center gap-2 transition-colors"
//                       >
//                         <LogOut className="h-4 w-4" />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className="bg-black min-h-[calc(100vh)] z-0">
//             <div className="">{children}</div>
//             <Toaster position="top-right" />
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//     </div>
//   );
// };
// export default DashboardLayout;

"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode, useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/Shared/dashboard/sidebar/AppSidebar";
import useScrollTrigger from "@/hooks/useScrollTrigger";
import { LogOut, User } from "lucide-react";
import { Toaster } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
// Updated imports - added startTokenExpiryMonitor
import { 
  isAuthenticated, 
  logoutAdmin, 
  startTokenExpiryMonitor 
} from "@/services/admin.auth/admin.auth";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { scrolled } = useScrollTrigger();
  const [showLogout, setShowLogout] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      // Skip auth check for login page
      if (pathname === "/dashboard/admin/login") {
        setIsChecking(false);
        return;
      }

      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push("/dashboard/admin/login");
      } else {
        setIsChecking(false);
        // ✅ START AUTOMATIC TOKEN MONITORING HERE
        startTokenExpiryMonitor();
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    logoutAdmin();
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

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="">
          <header
            className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-primary-200 z-10 shadow-sm bg-black ${
              scrolled && "shadow-md"
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
            <Toaster position="top-right" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
export default DashboardLayout;