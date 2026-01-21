"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/services/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MemberShipDate } from "./_components/MemberShipDate/MemberShipDate";

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
    // confirmEligibility: false,
    accessCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();
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

    // Access code required
    if (!formData.accessCode.trim()) {
      setApiError("Access code is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setApiError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setApiError("You must agree to the Terms & Conditions.");
      return;
    }

    if (!formData.dob) {
      setApiError("Please select a valid date of birth");
      return;
    }

    setLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dob,
      phone: formData.phone,
      accessCode: formData.accessCode,
    };

    try {
      const response = await registerUser(payload);
      console.log(response, "response")

      if (response?.success === true) {
        toast.success(response.message);
        // Redirect to OTP verification page
        router.push(`/member-reg-otp?email=${formData.email}`);
      }
      else {
        toast.error(response.message || "Invalid access code");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }


    //   if (response?.error) {
    //     toast.error(response.message || "Invalid access code");
    //   } else {
    //     toast.success(response.message);

    //     // Redirect to OTP verification page
    //     router.push(`/member-reg-otp?email=${formData.email}`);
    //   }
    // } catch (error) {
    //   console.error("Registration error:", error);
    //   setApiError("Registration failed. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 antialiased">
      <div className="w-full max-w-129 mx-auto">
        <h1 className="text-4xl lg:text-5xl text-white font-semibold font-serif text-center mb-10">
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
              spellCheck={false}
              value={formData.firstName}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
            <Input
              placeholder="Last name*"
              name="lastName"
              value={formData.lastName}
              spellCheck={false}
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
              spellCheck={false}
              value={formData.email}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
            <Input
              placeholder="Phone number*"
              type="tel"
              name="phone"
              spellCheck={false}
              value={formData.phone}
              onChange={handleChange}
              required
              className="text-white border-neutral-700"
            />
          </div>

          {/* DOB */}
          <MemberShipDate
            onDateChange={(date) =>
              setFormData((prev) => ({ ...prev, dob: date }))
            }
          />

          {/* Password */}
          <div className="relative">
            <Input
              placeholder="Create password*"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              spellCheck={false}
              onChange={handleChange}
              required
              className="text-white border-neutral-700 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <Eye className="w-5 h-5 text-neutral-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-neutral-400" />
              )}
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
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <Eye className="w-5 h-5 text-neutral-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-neutral-400" />
              )}
            </button>
          </div>

          {/* Access Code */}
          <div>
            <Input
              placeholder="Code*"
              name="accessCode"
              // required
              value={formData.accessCode}
              onChange={handleChange}
              spellCheck={false}
              className="text-white border-neutral-700"
            />
            <p className="text-[#FFFFFFB3] text-sm italic mt-2">
              No Code? DM us for access.
            </p>
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
                className="text-[#FFFFFFB3] text-sm"
              >
                I agree to Solenne’s{" "}
                <Link href="/become-member" className="underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* <div className="flex items-center gap-3">
              <Checkbox
                id="confirmEligibility"
                checked={formData.confirmEligibility}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange("confirmEligibility", checked)
                }
              />
              <label
                htmlFor="confirmEligibility"
                className="text-[#FFFFFFB3] text-sm"
              >
                Solenne is a women’s-only membership. Please confirm your
                eligibility.
              </label>
            </div> */}
          </div>

          {/* Submit */}
          <div className="pt-8 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-black cursor-pointer text-white border border-white px-10 py-3.5 rounded-full hover:bg-white hover:text-black transition"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipRegister;


// "use client";

// import { Eye, EyeOff } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { MemberShipDate } from "./_components/MemberShipDate/MemberShipDate";
// import Link from "next/link";

// import { registerUser } from "@/services/auth";
// import { toast } from "sonner";

// const MembershipRegister = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     dob: "",
//     password: "",
//     confirmPassword: "",
//     agreeTerms: false,
//     confirmEligibility: false,
//     accessCode: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validCoupon = "SOLENNE15";

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCheckboxChange = (name: string, checked: boolean) => {
//     setFormData((prev) => ({ ...prev, [name]: checked }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setApiError("");

//     // Basic validation
//     if (formData.password !== formData.confirmPassword) {
//       setApiError("Passwords do not match");
//       return;
//     }

//     if (!formData.agreeTerms || !formData.confirmEligibility) {
//       setApiError("You must accept all required conditions");
//       return;
//     }

//     if (!formData.dob) {
//       setApiError("Please select a valid date of birth");
//       return;
//     }

//     setLoading(true);

//     // Validate coupon if provided
//     if (formData.accessCode && formData.accessCode !== validCoupon) {
//       toast.error("Invalid coupon code");
//       setLoading(false);
//       return;
//     }

//     // Payload
//     const payload = {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       password: formData.password,
//       dateOfBirth: formData.dob,
//       phone: formData.phone,
//       coupon: formData.accessCode || undefined,
//     };

//     try {
//       const response = await registerUser(payload);
//       // console.log("response:", response);

//       if (response?.error) {
//         toast.error("User already registered");
//       } else {
//         toast.success(response.message);

//         if (response?.data?.onBoardingLink) {
//           window.location.href = response.data.onBoardingLink;
//         }
//       }

//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       setApiError("Registration failed. Please try again.");
//       console.error("Error during registration:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-5 antialiased">
//       <div className="w-full max-w-129 mx-auto">
//         <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center mb-10">
//           Join Solenne
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {apiError && (
//             <p className="text-red-400 text-center mb-4">{apiError}</p>
//           )}

//           {/* Name */}
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               placeholder="First name*"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               required
//               className="text-white border-neutral-700"
//             />
//             <Input
//               placeholder="Last name*"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               required
//               className="text-white border-neutral-700"
//             />
//           </div>

//           {/* Email + Phone */}
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               placeholder="Email*"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="text-white border-neutral-700"
//             />
//             <Input
//               placeholder="Phone number*"
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className="text-white border-neutral-700"
//             />
//           </div>

//           {/* Date Picker */}
//           <div className="relative">
//             <MemberShipDate
//               onDateChange={(date) =>
//                 setFormData((prev) => ({ ...prev, dob: date }))
//               }
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Input
//               placeholder="Create password*"
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="text-white border-neutral-700 pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               {showPassword ? (
//                 <Eye className="w-5 h-5 text-neutral-400 cursor-pointer" />
//               ) : (
//                 <EyeOff className="w-5 h-5 text-neutral-400 cursor-pointer" />
//               )}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <Input
//               placeholder="Re-enter password*"
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="text-white border-neutral-700 pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               {showConfirmPassword ? (
//                 <Eye className="w-5 h-5 text-neutral-400 cursor-pointer" />
//               ) : (
//                 <EyeOff className="w-5 h-5 text-neutral-400 cursor-pointer" />
//               )}
//             </button>
//           </div>

//           <div className="grow">
//             <Input
//               placeholder="Access code*"
//               name="accessCode"
//               required
//               value={formData.accessCode}
//               onChange={handleChange}
//               className="text-white border-neutral-700 focus:border-neutral-500"
//             />
//             <p className="text-[#FFFFFFB3] text-sm italic mt-2">
//               No Code? DM us for access.
//             </p>
//           </div>

//           {/* Checkboxes */}
//           <div className="space-y-8 mt-10">
//             <div className="flex items-center gap-3">
//               <Checkbox
//                 id="agreeTerms"
//                 checked={formData.agreeTerms}
//                 onCheckedChange={(checked: boolean) =>
//                   handleCheckboxChange("agreeTerms", checked)
//                 }
//               />
//               <label
//                 htmlFor="agreeTerms"
//                 className="text-[#FFFFFFB3] text-sm cursor-pointer"
//               >
//                 I have read and agree to Solenne&lsquo;s{" "}
//                 <Link href="/become-member" className="underline">
//                   Terms & Conditions
//                 </Link>
//                 .
//               </label>
//             </div>

//             <div className="flex items-center gap-3">
//               <Checkbox
//                 id="confirmEligibility"
//                 checked={formData.confirmEligibility}
//                 onCheckedChange={(checked: boolean) =>
//                   handleCheckboxChange("confirmEligibility", checked)
//                 }
//               />
//               <label
//                 htmlFor="confirmEligibility"
//                 className="text-[#FFFFFFB3] text-sm cursor-pointer"
//               >
//                 Solenne is a women&lsquo;s-only membership. Please confirm your
//                 eligibility.
//               </label>
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="pt-8 flex justify-center">
//             <Button
//               type="submit"
//               disabled={loading}
//               className="bg-black cursor-pointer text-white border text-base border-white font-medium py-3.5 px-10 rounded-full hover:bg-white hover:text-black transition"
//             >
//               {loading ? "Processing..." : "Proceed to Payment"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MembershipRegister;
