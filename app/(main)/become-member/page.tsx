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
              245 <span className="lg:text-lg">USD</span>
            </p>
            <p className=" text-center lg:text-lg mb-6 leading-relaxed text-gray-300">
              Annual membership
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
                  {`across a global network of considered wellbeing and lifestyle destinations`}
                </li>

                <li>
                  <span className="font-semibold">
                    Private member gatherings
                  </span> and partner experiences
                </li>

                <li>
                  <span className="font-semibold">Digital membership</span> recognised across our partner network
                </li>

                <li>
                  <span className="font-semibold">Member newsletter</span>{" "}
                  ffeaturing extended partner privileges
                </li>
              </ul>
            </div>
            <div className="flex justify-center mt-6 mb-2">
              <Link href="/member-registration">
                <Button className="border border-[#f0cea2e7] cursor-pointer text-sm lg:text-base px-10 py-3 lg:px-7 lg:py-2.5 rounded-full tracking-widest bg-black text-white hover:bg-white hover:text-black hover:border-black transition-colors duration-200">
                  Become a member
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
