/* eslint-disable @typescript-eslint/no-explicit-any */
// import { getPartners } from "@/services/partner/partner";
import { getPartners } from "@/services/partner/getpartner";
import FeaturedPartnersCarouselClient from "./FeaturedPartnersCarouselClient";

export default async function FeaturedPartnersCarousel() {
  const res = await getPartners();

  if ("error" in res) {
    return null; // or error UI
  }

  // only featured partners
 const featuredPartners = res.data.filter(
  (partner) =>
    partner.isFeatured === true || partner.isFeatured === "true" as any
);



  return (
    <FeaturedPartnersCarouselClient partners={featuredPartners} />
  );
}
