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
          className="text-[#FFFFF0] text-base lg:text-xl mb-6 hover:text-white/80 transition-all"
        >
          info@solenneuae.com
        </Link>
        <div className="flex items-center gap-15">
          <Link
            href="https://www.instagram.com/solenneuae/"
            target="_blank"
            className="hover:opacity-80 transition-all"
            aria-label="Instagram"
          >
            <InstaIcon />
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61582334074058"
            target="_blank"
            className="hover:opacity-80 transition-all"
            aria-label="Facebook"
          >
            <FacebookIcon />
          </Link>
          <Link
            href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQGXqAcWK4wbswAAAZqxpXEoD4mcJnAGmSM1Msx5d99qgkpMKZ--T61iUJSbaOz0iyhwX0F9XEOcp9Rfrte1i6K5tyS_uziDWNIwwPuixdPMebl2xfa3BztRBl6EjTYv2ZUp2J4=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fsolenne-uae%2F"
            target="_blank"
            className=" hover:opacity-80 transition-all"
            aria-label="LinkedIn"
          >
            <LinkdeinIcon />
          </Link>
          <Link

             href="mailto:info@solenneuae.com"
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
