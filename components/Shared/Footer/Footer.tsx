import {
  FacebookIcon,
  InstaIcon,
  LinkdeinIcon,
} from "@/components/Icons/Icons";
import { Instagram, Facebook, Linkedin, Mail, MailIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 md:py-8">
      <div className="flex flex-col items-center gap-6">
        <a
          href="mailto:info@solenneuae.com"
          className="text-white text-xl mb-6 hover:text-white/80 transition-colors"
        >
          info@solenneuae.com
        </a>
        <div className="flex items-center gap-15">
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Instagram"
          >
            <InstaIcon />
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkdeinIcon />
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Email"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
