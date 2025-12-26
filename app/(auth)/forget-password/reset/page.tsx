// app/forget-password/reset/page.tsx
import React, { Suspense } from "react";
import ResetPasswordPageClient from "../_components/ResetPasswordPageClient";
// import ResetPasswordPageClient from "./ResetPasswordPageClient";

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<BeautifulLoader fullScreen text="Preparing Reset" />}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
