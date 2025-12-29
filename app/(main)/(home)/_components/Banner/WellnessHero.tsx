// import bannerImg from "@/public/assets/home/banner.png";
// import Image from "next/image";

// export default function WellnessHero() {
//   return (
//     <section className="relative h-[50vh] lg:h-[80vh]">
//       {/* Image with full-width background and overlay */}
//       <div className=" inset-0 z-0">
//         <Image
//           src={bannerImg}
//           alt="Infrared sauna wellness therapy"
//           className="w-full h-full object-cover"
//           layout="fill"
//         />
//         <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
//         {/* Overlay */}
//       </div>

//       {/* Content on top of image */}
//       <div className="relative w-full h-full flex items-center justify-center">
//         {/* Text */}
//         <div className="text-center space-y-6 lg:space-y-8 lg:pr-8">
//           <h1 className="text-white text-2xl md:text-3xl lg:text-5xl max-w-3xl mx-auto font-semibold font-serif leading-tight">
//             A lifestyle membership redefining how women experience wellness in
//             Dubai.
//           </h1>
//         </div>
//       </div>
//     </section>
//   );
// }

import bannerImg from "@/public/assets/home/banner.png";
import Image from "next/image";

export default function WellnessHero() {
  return (
    <section className="relative h-[50vh] lg:h-[80vh]">
      {/* Image with full-width background and overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerImg}
          alt="Infrared sauna wellness therapy"
          className="object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      {/* Content on top of image */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        {/* Text */}
        <div className="text-center space-y-6 lg:space-y-8 lg:pr-8">
          <h1 className="text-white text-2xl md:text-3xl lg:text-5xl max-w-3xl mx-auto font-semibold font-serif leading-tight">
            A lifestyle membership redefining how women experience wellness in
            Dubai.
          </h1>
        </div>
      </div>
    </section>
  );
}