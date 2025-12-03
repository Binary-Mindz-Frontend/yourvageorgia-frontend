import { Navbar } from "@/components/navbar";
import Footer from "@/components/Shared/Footer/Footer";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
