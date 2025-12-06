"use client";
import { Toaster } from "react-hot-toast";
import UserProvider from "@/context/UserContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
// import Footer from "@/components/Shared/Footer/Footer";

// import { Toaster } from "react-hot-toast";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark"  enableSystem={false}  disableTransitionOnChange>
        <UserProvider>
          <Toaster position="top-center" />
          {children}
        </UserProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;