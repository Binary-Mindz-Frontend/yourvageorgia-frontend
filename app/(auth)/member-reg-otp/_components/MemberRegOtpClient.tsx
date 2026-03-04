"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateOtp, verifyRegistrationOtp } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MemberRegOtpClient() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const params = useSearchParams();
    const email = params.get("email");
    const router = useRouter();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email is missing. Please register again.");
            return;
        }

        setLoading(true);

        const res = await verifyRegistrationOtp({ email, otp });
        setLoading(false);

        if (res.success) {
            toast.success("Registration verified successfully");
            // router.push("/login");
            if (res.data?.onBoardingLink) {
                router.push(res.data?.onBoardingLink);
            }
        } else {
            toast.error(res.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Email is missing.");
            return;
        }

        setResending(true);
        const res = await generateOtp({ email });
        setResending(false);

        if (res.success) {
            toast.success("OTP resent successfully");
        } else {
            toast.error(res.message || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleVerify}
                className="w-full max-w-sm space-y-6 p-6 shadow-md rounded-xl"
            >
                <h1 className="text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-10">
                    Verify Registration
                </h1>

                <p className="text-neutral-400 text-center text-sm mb-4">
                    Please enter the 6-digit OTP sent to <br />
                    <span className="text-white font-medium">{email}</span>
                </p>

                <Input
                    placeholder="6-digit OTP"
                    value={otp}
                    spellCheck={false}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="rounded-full px-6 text-center tracking-[0.5em]"
                    maxLength={6}
                />

                <div className="flex justify-center flex-col items-center gap-4">
                    <div className="flex justify-center">
                        <Button
                            className="bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200"
                            type="submit"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-neutral-400 text-sm">
                            Didn't receive the code?
                        </p>
                        <button
                            type="button"
                            disabled={resending}
                            onClick={handleResendOtp}
                            className="text-white cursor-pointer hover:underline text-sm font-medium disabled:opacity-50"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>

                    <button
                        type="button"
                        className="text-neutral-400 hover:text-white text-sm underline transition-colors mt-4"
                        onClick={() => router.back()}
                    >
                        Back to registration
                    </button>
                </div>
            </form>
        </div>
    );
}
