"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { verifyForgetOtp } from "@/app/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { verifyForgetOtp } from "@/services/auth";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVerify = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await verifyForgetOtp({ email: email!, otp });
    setLoading(false);

    if (res.success) {
      toast.success("OTP verified!");
      router.push(`/forget-password/reset?email=${email}`);
    } else {
      toast.error(res.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-sm space-y-6 p-6 shadow-md rounded-xl"
      >
        <h1 className="text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-10">
          Verify OTP
        </h1>

        <Input
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="rounded-full px-6"
        />
        <div className="flex justify-center">
          <Button
            className="bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200"
            type="submit"
          >
            {loading ? <BeautifulLoader size="sm" text="Verifying..." /> : "Verify OTP"}
          </Button>
        </div>
      </form>
    </div>
  );
}
