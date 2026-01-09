"use client";
import FavouriteSync from "@/components/FavouriteSync";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import UserProvider from "@/context/UserContext";
// import Footer from "@/components/Shared/Footer/Footer";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <UserProvider>
          <Toaster position="top-right" expand={true} richColors />
          <FavouriteSync />
          {children}
        </UserProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;