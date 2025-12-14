import { getPartners } from "@/services/partner/partner";
import FeaturedPartnersCarouselClient from "./FeaturedPartnersCarouselClient";

export default async function FeaturedPartnersCarousel() {
  const res = await getPartners();

  if ("error" in res) {
    return null; // or error UI
  }

  // only featured partners
  const featuredPartners = res.data.filter(
    (partner) => partner.isFeatured === "true"
  );

  return (
    <FeaturedPartnersCarouselClient partners={featuredPartners} />
  );
}
