// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";
// import { createStripeSession } from "@/services/stripe";

// export default function CheckoutPage() {
//   const [email, setEmail] = useState("");
//   const [coupon, setCoupon] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     if (!email) return toast.error("Email is required");

//     setLoading(true);

//     const res = await createStripeSession({
//       email,
//       coupon: coupon || undefined, // optional
//     });

//     setLoading(false);

//     if (!res.success) {
//       toast.error(res.message || "Failed to create session");
//       return;
//     }

//     const sessionId = res.data;

//     if (!sessionId) {
//       toast.error("No session ID returned");
//       return;
//     }

//     toast.success("Redirecting to Stripe...");
//     // Redirect user to Stripe Checkout
//     window.location.href = res.data;
//   };

//   return (
//     <div className="h-[90vh] flex items-center justify-center px-4">
//       <div className="w-full max-w-sm  shadow-lg p-6 rounded-xl space-y-6">
//         <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center mb-10">
//           Stripe Checkout
//         </h1>
//         <Input
//           placeholder="Enter Email"
//           type="email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="rounded-full px-6"
//         />

//         <Input
//           placeholder="Coupon (optional)"
//           value={coupon}
//           onChange={(e) => setCoupon(e.target.value)}
//           className="rounded-full px-6"
//         />

//         <div className="flex justify-center">
//           <Button
//             className="bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200"
//             onClick={handleCheckout}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Pay Now"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { createStripeSession } from "@/services/stripe";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email) return toast.error("Email is required");

    setLoading(true);

    // Ensure this API call is made after client-side render
    try {
      const res = await createStripeSession({
        email,
        coupon: coupon || undefined, // optional
      });

      if (!res.success) {
        toast.error(res.message || "Failed to create session");
        return;
      }

      const sessionId = res.data;

      if (!sessionId) {
        toast.error("No session ID returned");
        return;
      }

      toast.success("Redirecting to Stripe...");
      // Redirect user to Stripe Checkout
      window.location.href = sessionId;
    } catch (error) {
      toast.error("An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm shadow-lg p-6 rounded-xl space-y-6">
        <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center mb-10">
           Checkout
        </h1>
        <Input
          placeholder="Enter Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full px-6"
        />

        <Input
          placeholder="Coupon (optional)"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="rounded-full px-6"
        />

        <div className="flex justify-center">
          <Button
            className="bg-black cursor-pointer px-10 text-white border-white mt-4 md:mt-0 hover:bg-white hover:text-black hover:border-black transition-colors duration-200"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
