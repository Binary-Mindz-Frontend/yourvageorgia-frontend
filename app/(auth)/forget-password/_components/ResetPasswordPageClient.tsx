"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPageClient() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await resetPassword({ email: email!, password });
    setLoading(false);

    if (res.success) {
      toast.success("Password reset successfully");
      router.push("/login");
    } else {
      toast.error(res.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-sm space-y-6 p-6 shadow-md rounded-xl"
      >
        <h1 className="text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-10">
          Reset Password
        </h1>

        <Input
          placeholder="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-full px-6"
          autoComplete="new-password"
        />
        <div className="flex justify-center">
          <Button
            className="bg-black cursor-pointer px-6 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200"
            type="submit"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
