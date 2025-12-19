export const dynamic = 'force-dynamic';
import WellnessHero from "./_components/Banner/WellnessHero";
import CTAButton from "./_components/CTA/CTAButton";
import FeaturedPartners from "./_components/FeaturedPartners/FeaturedPartners";
import SolenneMembership from "./_components/SolenneMembership/SolenneMembership";
import WellnessCards from "./_components/WellnessCards/WellnessCards";

export default function HomePage() {
  return (
    <div className="container min-w-full mx-auto">
      <WellnessHero />
      <CTAButton/>
      <WellnessCards />
      {/* <SolenneMembership /> */}
      <FeaturedPartners />
    </div>
  );
}
