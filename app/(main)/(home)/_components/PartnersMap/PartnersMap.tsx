"use client";

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

interface Partner {
  _id: string;
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address: string;
  addressUrl: string;
}

interface PartnersMapProps {
  partners: Partner[];
  onMarkerClick?: (partner: Partner) => void;
}

export const DEFAULT_MAP_CENTER = {
  lat: 25.2048, // Dubai
  lng: 55.2708,
};

export default function PartnersMap({
  partners,
  onMarkerClick,
}: PartnersMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // ✅ Extract valid locations
  const locations = useMemo(
    () =>
      partners.filter(
        (p) =>
          p.coordinates &&
          typeof p.coordinates.lat === "number" &&
          typeof p.coordinates.lng === "number"
      ),
    [partners]
  );

  // ✅ Fit map to markers automatically
  useEffect(() => {
    if (!map || locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    locations.forEach((p) => {
      bounds.extend({
        lat: p.coordinates!.lat,
        lng: p.coordinates!.lng,
      });
    });

    map.fitBounds(bounds);
  }, [map, locations]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={
          locations.length > 0
            ? {
                lat: locations[0].coordinates!.lat,
                lng: locations[0].coordinates!.lng,
              }
            : DEFAULT_MAP_CENTER
        }
        zoom={locations.length > 0 ? 13 : 11}
        onLoad={(mapInstance) => setMap(mapInstance)} // ✅ FIXED ERROR
      >
        {locations.map((partner) => (
          <Marker
            key={partner._id}
            position={{
              lat: partner.coordinates!.lat,
              lng: partner.coordinates!.lng,
            }}
            onClick={() => onMarkerClick?.(partner)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
