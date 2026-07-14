
"use client";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Script from "next/script";
import { Maximize, Map as MapIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GrLocationPin } from "react-icons/gr";
import { useCity } from "@/context/CityContext";

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

export const MAP_CENTERS = {
  dubai: {
    lat: 25.1257824,
    lng: 55.2279979,
  },
  london: {
    lat: 51.5074,
    lng: -0.1278,
  },
  international: {
    lat: 25.0,
    lng: 15.0,
  }
};

export default function PartnersMap({
  partners,
  onMarkerClick,
  onMarkerHover,
}: PartnersMapProps) {
  const { city } = useCity();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const currentCenter = useMemo(() => MAP_CENTERS[city], [city]);

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

  // Sync map center when city changes
  useEffect(() => {
    if (map && currentCenter) {
      map.panTo(currentCenter);
      map.setZoom(city === 'international' ? 3 : 11);
    }
  }, [map, currentCenter]);

  const markerIcon = useMemo(() => {
    if (!mapLoaded || typeof window === "undefined" || !window.google) {
      return undefined;
    }

    const iconMarkup = renderToStaticMarkup(
      <GrLocationPin
        style={{
          width: '30px',
          height: '30px',
          color: '#000000'
        }}
      />
    );

    const svgString = encodeURIComponent(iconMarkup);

    return {
      url: `data:image/svg+xml;utf8, ${svgString}`,
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: new window.google.maps.Point(20, 30),
    };
  }, [mapLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Function to fit all markers
  const handleFitBounds = useCallback(() => {
    if (!map || locations.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((location) => {
      bounds.extend(location.coordinates);
    });
    const padding = { top: 50, right: 50, bottom: 50, left: 50 };
    map.fitBounds(bounds, padding);
  }, [map, locations]);

  // Function to reset to initial view
  const handleResetView = useCallback(() => {
    if (!map) return;
    map.setCenter(currentCenter);
    map.setZoom(city === 'london' ? 12 : city === 'international' ? 3 : 11);
  }, [map, currentCenter, city]);

  return (
    <div className="relative w-full h-full">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="afterInteractive"
        onLoad={() => setMapLoaded(true)}
      />
      {mapLoaded && (
        <GoogleMap
          options={{
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: false,
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={currentCenter}
          zoom={city === 'london' ? 12 : city === 'international' ? 3 : 11}
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
      )}

      {/* Floating Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleFitBounds}
          className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors text-xs font-medium flex items-center gap-2"
          title="Show all partners"
        >
          <Maximize size={16} />
          <span>Show All</span>
        </button>
        <button
          onClick={handleResetView}
          className="bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors text-xs font-medium flex items-center gap-2"
          title="Reset to default view"
        >
          <MapIcon size={16} />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
}

