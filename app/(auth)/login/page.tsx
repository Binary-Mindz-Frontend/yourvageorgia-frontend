"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { loginUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

const MemberLogin = () => {
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // UI States

  const [isLoading] = useState(false);
  const { setUser, setIsLoading } = useUser();

  // Handle submit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);
    // toast.loading("Logging in...", { id: "login" });

    const payload = {
      email,
      password,
    };

    const res = await loginUser(payload);

    if (res?.success) {
    toast.success("Login successful!", { 
      id: "login",
      style: {
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
      },
      icon: null,
    });
      setUser(res?.data?.user);
      setIsLoading(false);

      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } else {
    toast.error(res?.message || "Invalid email or password.", {
      id: "login",
      style: {
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
      },
      icon: null, 
    });
  }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full md:max-w-sm p-4 md:p-8 space-y-8">
        {/* Title */}
        <h1 className="text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-10">
          Member Login
        </h1>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <Input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-full px-6"
          />

          {/* Password */}
          <Input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="rounded-full px-6"
          />

          {/* Button */}
          <div className="pt-1 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className={`bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200 ${isLoading
                  ? "border-gray-600 bg-gray-900 cursor-not-allowed"
                  : "border-white"
                }`}
            >
              {isLoading ? <BeautifulLoader size="sm" text="Processing..." /> : "Login"}
            </Button>
          </div>
        </form>


        {/* Forgot Password */}
        <div className="text-center pt-3">
          <Link
            href="/forget-password"
            className="text-sm text-white/70 hover:text-white transition duration-300"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
