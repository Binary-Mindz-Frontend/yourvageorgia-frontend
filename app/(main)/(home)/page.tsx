
import WellnessCards from "./_components/WellnessCards/WellnessCards";
import WellnessHero from "./_components/Banner/WellnessHero";
import SolenneMembership from "./_components/SolenneMembership/SolenneMembership";
import FeaturedPartners from "./_components/FeaturedPartners/FeaturedPartners";

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <WellnessHero/>
      <WellnessCards/> 
      <SolenneMembership/>
      <FeaturedPartners/>
    </div>
  );
}
