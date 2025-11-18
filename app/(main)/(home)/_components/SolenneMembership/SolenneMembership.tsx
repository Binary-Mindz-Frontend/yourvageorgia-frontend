
import { ArrowRight, Plus, Minus } from 'lucide-react';
import img from "@/assets/home/map_bg.svg";

export default function SolenneMembership() {


  return (
    <div className="min-h-scree text-white flex items-center justify-center">
      <div className="w-full">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          
          {/* Left Section - Image and Text */}
          <div className="relative bg-black">
            {/* Background Image with Mirrors */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(img)`
              }}
            >
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-12 h-full flex flex-col justify-end min-h-[400px]">
              <h2 className="text-3xl font-light mb-3 tracking-wide">
                Lumé Aesthetics
              </h2>
              <div className="flex items-center gap-2 text-sm font-light">
                <span>15% off facial and rejuvenation treatments</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right Section - Map */}
          <div className="relative bg-gray-100 min-h-[400px]">
            {/* Google Map Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6828568059!2d54.89782139453125!3d25.076022800000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>

        {/* Bottom Description */}
        <div className="mt-12 text-center max-w-4xl mx-auto">
          <p className="text-gray-300 text-base leading-relaxed font-light">
            Solenne is a digital lifestyle membership for women in Dubai, connecting members to a curated network of wellness, 
            beauty and lifestyle destinations across the city. Members exclusively have access to enjoy preferred rates and 
            experiences designed to elevate everyday living.
          </p>
        </div>
      </div>
    </div>
  );
}