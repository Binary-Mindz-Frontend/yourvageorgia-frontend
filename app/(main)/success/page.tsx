"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { loginUserWithToken } from "@/services/auth";
import toast from "react-hot-toast";

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

// Main component wrapped in Suspense
function SuccessPageContent() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const result = await loginUserWithToken(accessToken);

        if (result?.success) {
          toast.success("Membership successfully completed! Please visit your profile page.");
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          toast.error(result?.error || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [accessToken, router]);

  return (
    <div className="h-[65vh] flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful
        </h1>

        <div className="text-gray-600 mb-6 flex flex-col items-center gap-2">
          {loading ? (
            <BeautifulLoader size="sm" text="Finalizing your login..." />
          ) : (
            "Thank you for your payment. Your transaction has been completed successfully."
          )}
        </div>

        <div className="space-y-3">
          <Link href="/profile">
            <button className="w-full rounded-xl bg-black px-6 py-3 cursor-pointer text-sm font-semibold text-white transition duration-300 hover:bg-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              Go to Profile Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main export wrapped with Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<BeautifulLoader fullScreen text="Processing Success" />}>
      <SuccessPageContent />
    </Suspense>
  );
}
