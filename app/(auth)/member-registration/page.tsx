"use client";

import { EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MemberShipDate } from "./_components/MemberShipDate/MemberShipDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth";
import toast from "react-hot-toast";

const MembershipRegister = () => {
  const router = useRouter();


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    confirmEligibility: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setApiError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms || !formData.confirmEligibility) {
      setApiError("You must accept all required conditions");
      return;
    }

    if (!formData.dob) {
      setApiError("Please select a valid date of birth");
      return;
    }

    setLoading(true);

    // Payload with backend-friendly snake_case
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dob,
      phone: formData.phone,
    };

    const response = await registerUser(payload);
    toast.success(response.message);
    console.log("===============> res in client =========>", response);
    setLoading(false);

    if (response?.error) {
      setApiError(response.error);
      return;
    }

    // Success → redirect
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 antialiased">
      <div className="w-full max-w-[516px] mx-auto">
        <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center mb-10">
          Join Solenne
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {apiError && (
            <p className="text-red-400 text-center mb-4">{apiError}</p>
          )}

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First name*"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
            <Input
              placeholder="Last name*"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Email*"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
            <Input
              placeholder="Phone number*"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
          </div>

          {/* Date Picker */}
          <div className="relative">
            <MemberShipDate
              onDateChange={(date) =>
                setFormData((prev) => ({ ...prev, dob: date }))
              }
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              placeholder="Create password*"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-white border-neutral-700 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeOff className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              placeholder="Re-enter password*"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="text-white border-neutral-700 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeOff className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          {/* Checkboxes */}
          <div className="space-y-8 mt-10">
            <div className="flex items-center gap-3">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange("agreeTerms", checked)
                }
              />
              <label
                htmlFor="agreeTerms"
                className="text-[#FFFFFFB3] text-sm cursor-pointer"
              >
                I have read and agree to Solenne’s{" "}
                <Link href="/become-member" className="underline">
                  Terms & Conditions
                </Link>
                .
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="confirmEligibility"
                checked={formData.confirmEligibility}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange("confirmEligibility", checked)
                }
              />
              <label
                htmlFor="confirmEligibility"
                className="text-[#FFFFFFB3] text-sm cursor-pointer"
              >
                Solenne is a women’s-only membership. Please confirm your
                eligibility.
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-black cursor-pointer text-white border text-base border-white font-medium py-3.5 px-10 rounded-full hover:bg-white hover:text-black transition"
            >
              {loading ? "Processing..." : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipRegister;
