"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="h-[65vh] flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made. If this was a
          mistake, you can try again.
        </p>

        <div className="space-y-3">
          <Link href="/become-member">
            <button
              className="
                w-full cursor-pointer
                rounded-xl
                bg-black
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                duration-300
                hover:bg-gray-900
                active:scale-[0.98]
                focus:outline-none
                focus:ring-2
                focus:ring-black
                focus:ring-offset-2
              "
            >
              Try Again
            </button>
          </Link>

          <Link href="/">
            <button
              className="
                w-full mt-5 cursor-pointer
                rounded-xl
                border
                border-gray-300
                px-6
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                duration-300
                hover:bg-gray-100
                active:scale-[0.98]
                focus:outline-none
                focus:ring-2
                focus:ring-gray-400
                focus:ring-offset-2
              "
            >
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
