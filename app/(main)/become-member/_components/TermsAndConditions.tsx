"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TermsAndConditions() {
  const [open, setOpen] = useState(true);

  const sections = [
    {
      title: "Membership",
      text: "Solenne membership is AED 900 annually and provides exclusive access to partner offers and experiences. Memberships are non-transferable and non-refundable."
    },
    {
      title: "Membership Eligibility",
      text: "Open to individuals aged 21 and over."
    },
    {
      title: "Member Use",
      text: "Members must present their digital membership card at partner outlets to redeem benefits. Offers are managed directly by partners and may vary or change without notice. Screenshots of membership ID cards will not be accepted at partner outlets."
    },
    {
      title: "Bookings",
      text: "All appointments or reservations must be made directly with partner venues."
    },
    {
      title: "Payments & Renewals",
      text: "Payments are final. Memberships expire after one year and can be renewed through the Solenne platform."
    },
    {
      title: "Liability",
      text: "Solenne acts as a connecting platform only and is not liable for any loss, damage, or dissatisfaction arising from third-party services."
    },
    {
      title: "Privacy",
      text: "Your personal data is used only to manage your membership and enhance your experience."
    },
    {
      title: "Updates",
      text: "Solenne may update these terms without prior notice. Continued use of the website implies acceptance of any changes."
    }
  ];

  return (
    <div className="min-h-screen text-white lg:py-10 px-4">
      <div className="container mx-auto">

        {/* Title */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-center font-serif text-2xl lg:text-3xl font-semibold mb-8 flex justify-center items-center gap-2"
        >
          Terms & Conditions
          <span
            className={`transition-transform duration-300 inline-block ${open ? "rotate-180" : "rotate-0"
              }`}
          >
            <ChevronDown />
          </span>
        </button>

        {/* Content (Show/Hide) */}
        {open && (
          <div className="mt-6">
            {sections.map((sec, index) => (
              <div key={index} className="text-center mb-12">
                <h3 className="text-xl lg:text-2xl font-medium pb-2  border-b-2 border-neutral-700">{sec.title}</h3>
                <p className="text-sm lg:text-base text-[#FFFFFFB3] leading-relaxed px-4 pt-2">
                  {sec.text}
                </p>
              </div>
            ))}

            {/* <div className="w-full h-px bg-neutral-700 mb-6"></div> */}
          </div>
        )}
      </div>
    </div>
  );
}
