// components/AdminLogin.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginUser, logout } from "@/services/auth";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("Logging in...", { id: "admin-login" });
    const res = await loginUser({ email, password });

    if (res?.success) {
      const accessToken = res?.data?.accessToken;
      const decoded: any = jwtDecode(accessToken);
      const userRole = decoded?.role?.toLowerCase();

      if (userRole !== "admin") {
        toast.error("Access denied: You do not have administrator privileges.", { id: "admin-login" });
        await logout(); // Clear the standard cookies set by loginUser
        setIsLoading(false);
        return;
      }

      toast.success("Login successful", { id: "admin-login" });
      setTimeout(() => {
        router.push("/dashboard/admin/overview");
        router.refresh();
      }, 500);
    } else {
      toast.error(res?.message || "Invalid email or password.", {
        id: "admin-login",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full md:max-w-sm p-4 md:p-8 space-y-8">
        <h1 className="text-3xl lg:text-5xl text-center font-serif font-semibold text-white tracking-wider mb-10">
          Admin Login
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-full px-6 bg-neutral-900 text-white border-neutral-700"
          />

          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="rounded-full px-6 bg-neutral-900 text-white border-neutral-700"
          />

          <div className="pt-1 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className={`bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200 ${isLoading ? "border-gray-600 bg-gray-900 cursor-not-allowed" : "border-white"
                }`}
            >
              {isLoading ? "Processing..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;