import { Instagram, Facebook, Linkedin, Mail } from "lucide-react";

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
            <Instagram className="h-7 w-7" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h- w-5" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-7 w-7" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Email"
          >
            <Mail className="h-7 w-7" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
