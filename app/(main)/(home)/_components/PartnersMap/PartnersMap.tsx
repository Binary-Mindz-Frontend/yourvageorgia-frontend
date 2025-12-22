// "use client";

// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import { useEffect, useMemo, useState } from "react";

// interface Partner {
//   _id: string;
//   name: string;
//   coordinates?: {
//     lat: number;
//     lng: number;
//   };
//   address: string;
//   addressUrl: string;
// }

// interface PartnersMapProps {
//   partners: Partner[];
//   onMarkerClick?: (partner: Partner) => void;
// }

// export const DEFAULT_MAP_CENTER = {
//   lat: 25.2048, // Dubai
//   lng: 55.2708,
// };
// const BLACK_MARKER_ICON = {
//   path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
//   fillColor: "#000000",
//   fillOpacity: 1,
//   strokeColor: "#ffffff",
//   strokeWeight: 1,
//   scale: 1.5,
//   anchor: new google.maps.Point(12, 24),
// };


// export default function PartnersMap({
//   partners,
//   onMarkerClick,
// }: PartnersMapProps) {
//   const [map, setMap] = useState<google.maps.Map | null>(null);

//   // ✅ Extract valid locations
//   const locations = useMemo(
//     () =>
//       partners.filter(
//         (p) =>
//           p.coordinates &&
//           typeof p.coordinates.lat === "number" &&
//           typeof p.coordinates.lng === "number"
//       ),
//     [partners]
//   );

//   // ✅ Fit map to markers automatically
//   useEffect(() => {
//     if (!map || locations.length === 0) return;

//     const bounds = new google.maps.LatLngBounds();

//     locations.forEach((p) => {
//       bounds.extend({
//         lat: p.coordinates!.lat,
//         lng: p.coordinates!.lng,
//       });
//     });

//     map.fitBounds(bounds);
//   }, [map, locations]);

//   return (
//     <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "100%" }}
//         center={
//           locations.length > 0
//             ? {
//                 lat: locations[0].coordinates!.lat,
//                 lng: locations[0].coordinates!.lng,
//               }
//             : DEFAULT_MAP_CENTER
//         }
//         zoom={locations.length > 0 ? 13 : 11}
//         onLoad={(mapInstance) => setMap(mapInstance)} 
//       >
//         {locations.map((partner) => (
//           <Marker
//             key={partner._id}
//             position={{
//               lat: partner.coordinates!.lat,
//               lng: partner.coordinates!.lng,
//             }}
//             icon={BLACK_MARKER_ICON}
//             onClick={() => onMarkerClick?.(partner)}
//           />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// }


"use client";

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useMemo, useState, useCallback, useEffect } from "react";

interface Partner {
  _id: string;
  name: string;
  thumbnail?: string;
  about?: string;
  activity?: Array<{
    title: string;
  }>;
  contacts?: Array<{
    coordinates: {
      lat: number;
      lng: number;
    };
    officeName: string;
    phone?: string;
    address?: string;
    email?: string;
  }>;
}

interface PartnersMapProps {
  partners: Partner[];
  onMarkerClick?: (partner: Partner) => void;
  onMarkerHover?: (partner: Partner | null) => void;
}

export const DEFAULT_MAP_CENTER = {
  lat: 25.2048,
  lng: 55.2708,
};

export default function PartnersMap({
  partners,
  onMarkerClick,
  onMarkerHover,
}: PartnersMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const locations = useMemo(() => {
    return partners.flatMap((partner) =>
      (partner.contacts || []).map((contact) => ({
        ...partner,
        coordinates: contact.coordinates,
        officeName: contact.officeName,
        address: contact.address,
      }))
    );
  }, [partners]);

  const markerIcon = useMemo(() => {
    if (!mapLoaded || typeof window === "undefined" || !window.google) {
      return undefined;
    }

    return {
      url: `data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
        <path d='M32 5a21 21 0 0 0-21 21c0 17 21 33 21 33s21-16 21-33A21 21 0 0 0 32 5zm0 31a10 10 0 1 1 10-10 10 10 0 0 1-10 10z'/>
      </svg>`,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 40),
    };
  }, [mapLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend(location.coordinates);
      });
      
      const padding = { top: 100, right: 100, bottom: 100, left: 100 };
      map.fitBounds(bounds, padding);
      
      const listener = window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom) {
          map.setZoom(currentZoom - 1);
        }
      });
    }
  }, [map, locations]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      onLoad={() => setMapLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={
          locations.length > 0
            ? locations[0].coordinates
            : DEFAULT_MAP_CENTER
        }
        zoom={locations.length === 0 ? 13 : undefined}
        onLoad={onMapLoad}
      >
        {locations.map((location, idx) => (
          <Marker
            key={`${location._id}-${idx}`}
            position={location.coordinates}
            icon={markerIcon}
            onClick={() => onMarkerClick?.(location)}
            onMouseOver={() => onMarkerHover?.(location)}
            onMouseOut={() => onMarkerHover?.(null)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

