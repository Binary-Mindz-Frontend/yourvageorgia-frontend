/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { extractPlaceFromUrl } from "@/utils/extractPlaceFromUrl";
import { geocodePlace } from "@/utils/geocodePlace";
import { useEffect, useState } from "react";


interface PartnersMapProps {

  
  partners: any[];
  
  onMarkerClick?: (partner: any) => void;
}

export const DEFAULT_MAP_CENTER = {
  lat: 25.2048, // Dubai
  lng: 55.2708,
};

export default function PartnersMap({ partners, onMarkerClick }: PartnersMapProps) {
  const [locations, setLocations] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      if (partners.length === 0) return;

      const results = await Promise.all(
        partners.map(async (p) => {
          const place = extractPlaceFromUrl(p.address);
          return await geocodePlace(place);
        })
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setLocations(results.filter(Boolean) as any[]);
    };

    loadLocations();
  }, [partners]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={locations.length > 0 ? locations[0] : { lat: 25.2048, lng: 55.2708 }}
        zoom={locations.length > 0 ? 12 : 11}
      >
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={loc}
            onClick={() => onMarkerClick && onMarkerClick(partners[index])}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}


// "use client";

// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import { extractPlaceFromUrl } from "@/utils/extractPlaceFromUrl";
// import { geocodePlace } from "@/utils/geocodePlace";
// import { useEffect, useState, useRef } from "react";

// interface PartnersMapProps {
    
//     partners: any[];
   
//     onMarkerClick?: (partner: any) => void;
// }

// export const DEFAULT_MAP_CENTER = {
//     lat: 25.2048, // Dubai
//     lng: 55.2708,
// };

// export default function PartnersMap({ partners, onMarkerClick }: PartnersMapProps) {
//     const [locations, setLocations] = useState<{ lat: number; lng: number }[]>([]);
//     const mapRef = useRef<google.maps.Map | null>(null);

//     // Load locations from partner addresses
//     useEffect(() => {
//         const loadLocations = async () => {
//             if (partners.length === 0) return;

//             const results = await Promise.all(
//                 partners.map(async (p) => {
//                     const place = extractPlaceFromUrl(p.address);
//                     return await geocodePlace(place);
//                 })
//             );

//             setLocations(results.filter(Boolean) as any[]);
//         };

//         loadLocations();
//     }, [partners]);

//     // Auto-fit bounds to all markers
//     useEffect(() => {
//         if (!mapRef.current || locations.length === 0) return;

//         const bounds = new google.maps.LatLngBounds();
//         locations.forEach((loc) => bounds.extend(loc));

//         mapRef.current.fitBounds(bounds);

//         // Optional: zoom in slightly if only one marker
//         if (locations.length === 1) {
//             mapRef.current.setZoom(14); // zoom in closer for single marker
//         }
//     }, [locations]);

//     return (
//         <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//             <GoogleMap
//                 mapContainerStyle={{ width: "100%", height: "100%" }}
//                 center={DEFAULT_MAP_CENTER}
//                 zoom={14}
//                 onLoad={(map) => {
//                     mapRef.current = map;
//                     return;
//                 }}
//             >
//                 {locations.map((loc, index) => (
//                     <Marker
//                         key={index}
//                         position={loc}
//                         onClick={() => onMarkerClick && onMarkerClick(partners[index])}
//                     />
//                 ))}
//             </GoogleMap>
//         </LoadScript>
//     );
// }
