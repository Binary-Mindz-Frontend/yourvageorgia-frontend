import { Button } from "@/components/ui/button";
import Link from "next/link";
;

const CTAButton = () => {
  return (
    <div className="flex sm:flex-row justify-center gap-4 sm:gap-6 mt-20">
      <Link href="/become-member">
        <Button className="cursor-pointer py-2.5 rounded-full sm:w-auto text-sm lg:text-base tracking-wide px-6 bg-white text-black border-white hover:bg-black hover:text-white transition-colors duration-200">
          Become a member
        </Button>
      </Link>
      <Link href="/partnership">
        <Button
          variant={"outline"}
          className="cursor-pointer py-2.5 rounded-full sm:w-auto text-sm lg:text-base tracking-wide px-6 bg-black text-white border-white hover:bg-white hover:text-black hover:border-black transition-colors duration-200"
        >
          Partner with us
        </Button>
      </Link>
    </div>
  );
};

export default CTAButton;
