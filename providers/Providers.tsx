"use client";
import FavouriteSync from "@/components/FavouriteSync";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import UserProvider from "@/context/UserContext";
import { CityProvider } from "@/context/CityContext";
// import Footer from "@/components/Shared/Footer/Footer";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <UserProvider>
          <CityProvider>
            <Toaster position="top-right" expand={true} richColors />
            <FavouriteSync />
            {children}
          </CityProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;