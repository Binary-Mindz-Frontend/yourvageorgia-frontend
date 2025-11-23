import {
  FacebookIcon,
  FMailIcon,
  InstaIcon,
  LinkdeinIcon,
} from "@/components/Icons/Icons";
import { MailIcon } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="md:mt-12 py-8">
      <div className="flex flex-col items-center gap-6">
        <Link
          href="mailto:info@solenneuae.com"
          className="text-white text-xl mb-6 hover:text-white/80 transition-all"
        >
          info@solenneuae.com
        </Link>
        <div className="flex items-center gap-15">
          <Link
            href="#"
            className="hover:opacity-80 transition-all"
            aria-label="Instagram"
          >
            <InstaIcon />
          </Link>
          <Link
            href="#"
            className="hover:opacity-80 transition-all"
            aria-label="Facebook"
          >
            <FacebookIcon />
          </Link>
          <Link
            href="#"
            className=" hover:opacity-80 transition-all"
            aria-label="LinkedIn"
          >
            <LinkdeinIcon />
          </Link>
          <Link
            href="#"
            className=" hover:opacity-80 transition-all"
            aria-label="Email"
          >
           <FMailIcon/>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
