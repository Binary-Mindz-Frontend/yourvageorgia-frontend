import img from "@/public/assets/member/become-member.svg";
import TermsAndConditions from "./_components/TermsAndConditions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SolenneMembership = () => {
  return (
    <div className="min-h-screen text-white mt-5 lg:mt-28 p-4 lg:p-0">
      <div className="container mx-auto">
        {/* === Membership Card Section === */}
        <div
          className="w-full max-w-125 mx-auto rounded-xl shadow-2x overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${img.src})`,
          }}
        >
          <div className="p-10">
            <h2 className="text-4xl lg:text-5xl font-semibold font-serif tracking-wider text-center mb-2">
              Membership
            </h2>

            <h3 className=" text-center lg:text-lg mb-6 leading-relaxed text-gray-300">
              Founding Circle · Limited Capacity
            </h3>

            <p className=" lg:text-lg font-semibold text-center text-white ">
              900 <span className="lg:text-lg">AED</span>
            </p>
            <p className=" text-center lg:text-lg mb-6 leading-relaxed text-gray-300">
              12-month membership
            </p>

            <div className="space-y-4">
              <p className="text-center lg:text-lg leading-relaxed text-gray-300">
                {
                 "Preferred rates across Dubai's most considered wellness, beauty and lifestyle destinations."
                }
              </p>

              <p className="px-10 lg:px-0 text-center lg:text-lg text-gray-300">
                Invitations to intimate member gatherings and partner-led
                engagements
              </p>
              <p className="px-10 lg:px-0 text-center lg:text-lg text-gray-300">
                A discreet digital membership ID, recognized across our partner
                network.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us Button */}
        <div className="flex justify-center mb-24 mt-6">
          <Link href="/member-registration">
            <Button className="border border-white cursor-pointer text-sm lg:text-base px-10 py-3 lg:px-7 lg:py-2.5 rounded-full tracking-wider bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors duration-200">
              Become Member
            </Button>
          </Link>
        </div>

        <TermsAndConditions />
      </div>
    </div>
  );
};

export default SolenneMembership;
