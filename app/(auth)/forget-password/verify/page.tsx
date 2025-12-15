import { Suspense } from "react";
import VerifyOtpPage from "../_components/VerifyOtpClient";

const VerifyPasswordPage = () => {
  return (
     <Suspense fallback={<div>Loading...</div>}>
         <VerifyOtpPage />
       </Suspense>
  )
}

export default VerifyPasswordPage