import { Suspense } from "react";
import VerifyOtpPage from "../_components/VerifyOtpClient";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

const VerifyPasswordPage = () => {
  return (
    <Suspense fallback={<BeautifulLoader fullScreen text="Verifying Request" />}>
      <VerifyOtpPage />
    </Suspense>
  );
};

export default VerifyPasswordPage;