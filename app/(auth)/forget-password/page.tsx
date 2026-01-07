"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgetPassword } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await forgetPassword({ email });
    setLoading(false);

    if (res.success) {
      toast.success("OTP sent to your email!");
      router.push(`/forget-password/verify?email=${email}`);
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 shadow-md rounded-xl"
      >
        <h1 className="text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-10">Forgot Password</h1>

        <Input
          placeholder="Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-full px-6"
        />

        <div className="flex justify-center">
          <Button className="bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200" type="submit">
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      </form>
    </div>
  );
}
