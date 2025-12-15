/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import {
  MapPin,
  Globe,
  Instagram,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/app/(main)/network/_components/NetworkCardModal/Icon/Icons";
import ImageGallerySlider from "@/app/(main)/network/_components/ImageGallerySlider/ImageGallerySlider";

export default function FeaturePartnerModal({
  onClose,
  partner,
}: {
  onClose: () => void;
  partner: any;
}) {
  const galleryImages =
    partner.gallery?.length > 0 ? partner.gallery : [partner.thumbnail];

  return (
    <div className="min-h-screen container mx-auto text-white px-4 lg:px-0 py-10 overflow-y-auto scrollbar-hide">
      {/* Back Button */}
      <button
        onClick={onClose}
        className="cursor-pointer text-white mb-6 lg:mb-16 flex items-center gap-2 opacity-70 hover:opacity-100 transition"
      >
        <ChevronLeft className="lg:w-8 lg:h-8" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-6 lg:gap-10">
        {/* Right Section */}
        <div className="flex flex-col justify-start order-1">
          <div className="flex lg:py-4 pb-4 md:pb-0">
            <Button
              variant="outline"
              className="cursor-pointer py-3 border border-white/70 rounded-md sm:w-auto text-sm lg:text-base text-white/70 px-10"
            >
              {partner.category?.title}
            </Button>
          </div>

          <h1 className="text-2xl lg:text-4xl font-semibold font-serif lg:mt-6 mb-2">
            {partner.name}
          </h1>

          {partner.offer?.[0] && (
            <p className="lg:text-lg mb-4 lg:mb-6">
              {partner.offer[0].title}
            </p>
          )}

          <p className="leading-relaxed text-sm lg:text-base text-[#FFFFFFB3]">
            {partner.offer?.[0]?.description}
          </p>

          {partner.offer?.[0]?.validUntil && (
            <p className="lg:mt-4 text-sm lg:text-base text-[#FFFFFFB3]">
              Offer valid until{" "}
              {new Date(partner.offer[0].validUntil).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Left Section */}
        <div className="order-2 lg:order-0">
          <ImageGallerySlider images={galleryImages} />

          {/* About Section */}
          <div className="mt-10">
            <h2 className="lg:text-xl mb-6">
              About {partner.about?.title}
            </h2>
            <p className="text-[#FFFFFFB3] leading-relaxed text-base">
              {partner.about?.description}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-10">
            <h2 className="lg:text-xl mb-6">Terms & Conditions</h2>
            <ul className="space-y-1 text-[#FFFFFFB3] text-sm lg:text-base">
              {partner.terms?.map((term: string, index: number) => (
                <li key={index}>{index + 1}. {term}</li>
              ))}
            </ul>
          </div>

          {/* Contact & Locations */}
          <div className="mt-10 ">
            <h2 className="lg:text-xl mb-6">Contact & Locations</h2>

            <div className="space-y-3 text-[#FFFFFFB3] text-sm lg:text-base">
              {partner.contacts?.map((contact: any, index: number) => (
                <p key={index} className="flex items-center gap-2">
                  {index + 1}. {contact.address} {contact.phone}
                  <MapPin className="w-4 h-4" />
                </p>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-6 mt-10">
              {partner.socials?.website && (
                <a
                  href={partner.socials.website}
                  target="_blank"
                  className="p-3 rounded-full hover:bg-white/10 transition"
                >
                  <Globe className="lg:w-10 lg:h-10" />
                </a>
              )}

              {partner.socials?.instagram && (
                <a
                  href={partner.socials.instagram}
                  target="_blank"
                  className="p-3 rounded-full hover:bg-white/10 transition"
                >
                  <Instagram className="lg:w-10 lg:h-10" />
                </a>
              )}

              {partner.socials?.whatsapp && (
                <a
                  href={`https://wa.me/${partner.socials.whatsapp}`}
                  target="_blank"
                >
                  <WhatsappIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// /* eslint-disable @typescript-eslint/no-explicit-any */


// import Image from "next/image";
// import {
//   MapPin,
//   Globe,
//   Instagram,
//   ChevronLeft,
// } from "lucide-react";
// import img1 from "@/public/assets/network/gallery/1.jpg";
// import img2 from "@/public/assets/network/gallery/2.jpg";
// import img3 from "@/public/assets/network/gallery/3.jpg";
// import { Button } from "@/components/ui/button";
// import { WhatsappIcon } from "@/app/(main)/network/_components/NetworkCardModal/Icon/Icons";
// import ImageGallerySlider from "@/app/(main)/network/_components/ImageGallerySlider/ImageGallerySlider";


// export default function FeaturePartnerModal({ onClose, image }: any) {
//   const galleryImages = [img1, img2, img3];
//   return (
//     <div className="min-h-screen container mx-auto text-white px-4 lg:px-0 py-10 overflow-y-auto scrollbar-hide">
//       {/* Back Button */}
//       <button
//         onClick={onClose}
//         className="cursor-pointer text-white mb-6 lg:mb-16 flex items-center gap-2 opacity-70 hover:opacity-100 transition"
//       >
//         <ChevronLeft className="lg:w-8 lg:h-8" />
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-6 lg:gap-10">
//         {/* Right Section */}
//         <div className="flex flex-col justify-start order-1">
//           <div className="flex lg:py-4 pb-4 md:pb-0">
//             <Button
//               variant="outline"
//               className="cursor-pointer py-3 border border-white/70 rounded-md sm:w-auto text-sm lg:text-base text-white/70 px-10"
//             >
//               Movement
//             </Button>
//           </div>

//           <h1 className="text-2xl lg:text-4xl font-semibold font-serif lg:mt-6 mb-2">
//             The Hundred Wellness Centre
//           </h1>

//           <p className="lg:text-lg mb-4 lg:mb-6">
//             10% Off All Yoga, Pilates, and Wellness Classes
//           </p>

//           <p className="leading-relaxed text-sm lg:text-base text-[#FFFFFFB3]">
//             Present your Solenne member card to enjoy exclusive member rates …
//           </p>

//           <p className="lg:mt-4 text-sm lg:text-base text-[#FFFFFFB3]">
//             Offer valid until 01/04/2026
//           </p>
//         </div>

//         {/* Left Section */}
//         <div className="order-2 lg:order-0">
//             <ImageGallerySlider images={galleryImages} />

//           {/* About + Others (same static text) */}
//           {/* About Section */}
//           <div className="mt-10">
//             <h2 className="lg:text-xl mb-6">
//               About The Hundred Wellness Centre
//             </h2>
//             <p className="text-[#FFFFFFB3] leading-relaxed text-base">
//               The Hundred Wellness Centre is one of Dubai’s most serene
//               destinations for movement and holistic health. Nestled in
//               Jumeirah, it offers Pilates, Yoga, and functional movement classes
//               designed to restore balance, strength, and mindfulness. Every
//               class combines expert guidance, elegant interiors, and a calm
//               community space, inviting women to reconnect with their rhythm.
//             </p>
//           </div>

//           {/* Terms & Conditions */}
//           <div className="mt-10">
//             <h2 className="lg:text-xl mb-6">Terms & Conditions</h2>
//             <ul className="space-y-1 text-[#FFFFFFB3] text-sm lg:text-base">
//               <li>1. Valid for Solenne members only.</li>
//               <li>2. Cannot be combined with other offers or promotions.</li>
//               <li>3. Non-transferable and non-refundable.</li>
//             </ul>
//           </div>

//           {/* Contact & Locations */}
//           <div className="mt-10 ">
//             <h2 className="lg:text-xl mb-6">Contact & Locations</h2>

//             <div className="space-y-3 text-[#FFFFFFB3] text-sm lg:text-base">
//               <p className="flex items-center gap-2">
//                 1. Jumeirah 1, Dubai. Phone– 04 344 7333
//                 <MapPin className="w-4 h-4" />
//               </p>

//               <p className="flex items-center gap-2">
//                 2. City Walk, Dubai. Phone– 04 856 9923
//                 <MapPin className="w-4 h-4" />
//               </p>
//             </div>

//             {/* Social Icons */}
//             <div className="flex justify-center md:justify-start gap-6 mt-10">
//               <button className="p-3 rounded-full hover:bg-white/10 transition">
//                 <Globe className="lg:w-10 lg:h-10" />
//               </button>
//               <button className="p-3 rounded-full hover:bg-white/10 transition">
//                 <Instagram className="lg:w-10 lg:h-10" />
//               </button>
//               <button>
//                 <WhatsappIcon />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
