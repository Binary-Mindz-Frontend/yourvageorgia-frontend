"use client";
import { EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MemberShipDate } from "./_components/MemberShipDate/MemberShipDate";
import Link from "next/link";

// Main Application Component
const MembershipRegister = () => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-[516px] mx-auto p-6 lg:p-0">
        <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center mb-10 tracking-wider">
          Join Solenne
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Row: First Name and Last Name (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First name*"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className=" text-white border-neutral-700 focus:border-neutral-500"
            />
            <Input
              placeholder="Last name*"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className=" text-white border-neutral-700 focus:border-neutral-500"
            />
          </div>

          {/* Second Row: Email and Phone Number (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Email*"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className=" text-white border-neutral-700 focus:border-neutral-500"
            />
            <Input
              placeholder="Phone number*"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className=" text-white border-neutral-700 focus:border-neutral-500"
            />
          </div>

          {/* Third Row: Date of Birth (1 column with Calendar icon) */}
          <div className="relative">
            <MemberShipDate/>
          </div>

          {/* Fourth Row: Create Password (1 column with Eye icon) */}
          <div className="relative">
            <Input
              placeholder="Create password*"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className=" text-white border-neutral-700 focus:border-neutral-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>

          {/* Fifth Row: Re-enter Password (1 column with Eye icon) */}
          <div className="relative">
            <Input
              placeholder="Re-enter password*"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className=" text-white border-neutral-700 focus:border-neutral-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>

          {/* Checkboxes */}
          <div className="space-y-8 mt-10">  
            <div className="flex items-start gap-3">
              <Checkbox 
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked: boolean) => 
                  handleCheckboxChange('agreeTerms', checked)
                }
                className="border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label 
                htmlFor="agreeTerms" 
                className="text-[#FFFFFFB3] text-sm cursor-pointer"
              >
                I have read and agree to Solenne's{" "}
                <Link href='/become-member' className="underline">Terms & Conditions</Link>.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="confirmEligibility"
                checked={formData.confirmEligibility}
                onCheckedChange={(checked: boolean) => 
                  handleCheckboxChange('confirmEligibility', checked)
                }
                className="border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label 
                htmlFor="confirmEligibility" 
                className="text-[#FFFFFFB3] text-sm cursor-pointer"
              >
                Solenne is a women's-only membership. Please confirm your
                eligibility.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8 flex justify-center">
            <Link href="/payment">
            <Button
              type="submit"
              className="bg-black cursor-pointer text-white border border-white hover:bg-white hover:text-black transition-colors font-medium py-2 px-8 rounded-full shadow-lg"
            >
              Next
            </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipRegister;