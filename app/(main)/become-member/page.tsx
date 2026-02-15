import { Button } from "@/components/ui/button";
import img from "@/public/assets/member/become-member.svg";
import Link from "next/link";
import TermsAndConditions from "./_components/TermsAndConditions";

const SolenneMembership = () => {
  return (
    <div className="min-h-screen text-white mt-5 lg:mt-28 p-4 lg:p-0">
      <div className="container mx-auto">
        {/* === Membership Card Section === */}
        <div
          className="max-w-150 mx-auto p-10 rounded-xl bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${img.src})`,
          }}
        >
          <div className="">
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
            <hr
              className="my-4"
              style={{
                border: "none",
                height: "1px",
                background:
                  "linear-gradient(90deg, #f0cea2e7, #ccc, #f0cea2e7)",
                maskImage:
                  "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
              }}
            />
            {/* policy */}
            <div className="space-y-4 pl-5">
              <ul className="list-disc space-y-3 text-gray-300 lg:text-lg">
                <li>
                  <span className="font-semibold">Preferred rates </span> 
                  {`across Dubai's most considered wellness & lifestyle destinations`}
                </li>

                <li>
                  <span className="font-semibold">
                    Private member gatherings
                  </span> & curated partner experiences
                </li>

                <li>
                  <span className="font-semibold">Digital membership</span> ID
                  recognised across our partner network
                </li>

                <li>
                  <span className="font-semibold">Member newsletter</span>{" "}
                  featuring online partner privileges — extending beyond our
                  core destinations
                </li>
              </ul>
            </div>
            <div className="flex justify-center mt-6 mb-2">
              <Link href="/member-registration">
                <Button className="border border-[#f0cea2e7] cursor-pointer text-sm lg:text-base px-10 py-3 lg:px-7 lg:py-2.5 rounded-full tracking-widest bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors duration-200">
                  Become Member
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Join Us Button */}

        <TermsAndConditions />
      </div>
    </div>
  );
};

export default SolenneMembership;
