"use client";
import {
  ChevronDown,
  Calendar,
  RefreshCw,
  CreditCard,
  Banknote,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { VisaIcon } from "./_components/Icons/VisaIcon";

// Type definitions
type PaymentMethod = "card" | "net_banking" | "wallet";

interface PaymentOption {
  value: PaymentMethod;
  label: string;
}

interface FormData {
  paymentMethod: PaymentMethod;
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  accessCode: string;
}

interface DarkSelectProps {
  options: PaymentOption[];
  value: PaymentMethod;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

const renderMethodIcon = (method: string) => {
  const commonClasses = "w-5 h-5 text-white mr-2";

  switch (method) {
    case "Credit Card / Debit Card":
      return (
        <div className="bg-white py-1 px-0.5 rounded-[2px] mr-1">
          <VisaIcon />
        </div>
      );
    case "Net Banking":
      return <Banknote className={commonClasses} />;
    case "Wallet Payment":
      return <Wallet className={commonClasses} />;
    default:
      return <CreditCard className={commonClasses} />;
  }
};

/**
 * Custom Select/Dropdown Component styled to look like an input field.
 * UPDATED: Uses a real <select> element for accessibility and function.
 */
const DarkSelect: React.FC<DarkSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select a payment method",
}) => {
  // Determine the icon for the currently selected value
  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;
  const SelectedIcon = renderMethodIcon(selectedLabel);

  return (
    <div className="relative w-full">
      <div
        // Increased vertical padding from py-3 to py-4 for 52px height
        className="w-full border border-neutral-700 rounded-lg py-4 px-4 text-sm flex justify-between items-center cursor-pointer transition-colors hover:border-neutral-500"
      >
        <span className="flex items-center">
          {SelectedIcon}
          <span>{selectedLabel}</span>
        </span>
        <ChevronDown className="w-6 h-5 text-neutral-400" />
      </div>

      {/* Hidden <select> element overlaid for actual functionality and accessibility */}
      <select
        value={value}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            className="text-black px-4"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const paymentOptions: PaymentOption[] = [
  { value: "card", label: "Credit Card / Debit Card" },
  { value: "net_banking", label: "Net Banking" },
  { value: "wallet", label: "Wallet Payment" },
];

const Payment = () => {
  const [formData, setFormData] = useState<FormData>({
    paymentMethod: "card", // Default to Card
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    accessCode: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: e.target.value as PaymentMethod,
    }));
  };

  const handleAccessCodeRefresh = () => {
    console.log("Refreshing access code logic triggered.");
    // Add logic here to re-validate the access code
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Confirming payment with data:", formData);
    // Add payment processing logic here
  };

  // Decide which fields to show based on the selected payment method
  const isCardPayment = formData.paymentMethod === "card";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 antialiased">
      <div className="">
        {/* Title and Price Details */}
        <header className="text-center mb-10 space-y-4">
          <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center mb-8 tracking-wider">
            Confirm Your Membership
          </h1>
          <p className="text-xl lg:text-[32px] font-semibold text-[#FFFFFF]/70 font-serif">
            One-year access ·{" "}
            <span>900 AED</span>
          </p>
        </header>

        <div className="w-full max-w-[516px] mx-auto p-6 md:p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Method Dropdown (Custom styled) */}
            <DarkSelect
              options={paymentOptions}
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
              placeholder="Select Payment Method"
            />

            {/* Conditional Fields based on Payment Method */}
            {isCardPayment && (
              <>
                {/* Name on Card */}
                <Input
                  placeholder="Name on card"
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleChange}
                  className=" text-white border-neutral-700 focus:border-neutral-500"
                />

                {/* Card Number */}
                <Input
                  placeholder="Card number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className=" text-white border-neutral-700 focus:border-neutral-500"
                />

                {/* Expiry Date and CVV (2 columns) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div className="relative">
                    <Input
                      placeholder="Expiry date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className=" text-white border-neutral-700 focus:border-neutral-500 pr-10"
                    />
                    <Calendar className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                  </div>

                  {/* CVV */}
                  <Input
                    placeholder="CVV"
                    name="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={handleChange}
                    className=" text-white border-neutral-700 focus:border-neutral-500"
                  />
                </div>
              </>
            )}

            {/* Access Code Input - Always visible */}
            <div className="flex items-center space-x-3">
              <div className="grow">
                <Input
                  placeholder="Access code"
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleChange}
                  className=" text-white border-neutral-700 focus:border-neutral-500"
                />
              </div>
              {/* Refresh Icon Button - separate from input, aligned to the right */}
              <button
                type="button"
                onClick={handleAccessCodeRefresh}
                className="text-white hover:text-white transition-colors p-2"
                aria-label="Refresh Access Code"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-8 flex justify-center">
              <Button
                type="submit"
                className="bg-black cursor-pointer text-white border border-white hover:bg-white hover:text-black transition-colors font-medium py-2 px-8 rounded-full shadow-lg"
              >
                Confirm payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
