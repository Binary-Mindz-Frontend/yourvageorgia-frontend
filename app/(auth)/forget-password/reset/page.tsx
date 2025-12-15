// app/forget-password/reset/page.tsx
import React, { Suspense } from "react";
import ResetPasswordPageClient from "../_components/ResetPasswordPageClient";
// import ResetPasswordPageClient from "./ResetPasswordPageClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
