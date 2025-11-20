import img from "@/public/assets/member/become-member.svg";
import TermsAndConditions from "./_components/TermsAndConditions";
import Link from "next/link";

const SolenneMembership = () => {
  return (
    <div className="min-h-screen text-white mt-10 lg:mt-28 p-4 lg:p-0">
      <div className="container mx-auto">
        {/* === Membership Card Section === */}
        <div
          className="w-full max-w-[475px] h-[475px] mx-auto rounded-xl shadow-2x overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${img.src})`,
          }}
        >
          <div className="p-10">
            <h2 className="lg:text-5xl font-semibold font-serif tracking-wider text-center mb-2">
              Membership
            </h2>

            <p className="lg:text-[40px] font-semibold font-serif tracking-wide text-center text-amber-400 mb-16">
              900 AED/Year
            </p>

            <p className="lg:px-5 text-sm text-center lg:text-lg mb-6 leading-relaxed text-gray-300">
              One year of member access to preferred rates across our curated
              network of wellness, beauty and lifestyle partners in Dubai.
            </p>

            <p className="text-sm text-center lg:text-lg text-gray-300">
              Includes invitations to exclusive member events.
            </p>
          </div>
        </div>

        {/* Join Us Button */}
        <div className="flex justify-center mb-24 mt-6">
          <Link href="/member-registration">
            <button
              className="
            border border-white text-base px-7 py-2.5 rounded-full tracking-wider
            hover:bg-white hover:text-black transition duration-300
          "
            >
              Join Us
            </button>
          </Link>
        </div>

        <TermsAndConditions />
      </div>
    </div>
  );
};

export default SolenneMembership;
