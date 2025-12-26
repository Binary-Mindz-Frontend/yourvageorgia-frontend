
"use client";
import { GrLocationPin } from "react-icons/gr";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Maximize, Map as MapIcon } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

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
  lat: 25.1257824,
  lng: 55.2279979,
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
    map.setCenter(DEFAULT_MAP_CENTER);
    map.setZoom(11);
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        onLoad={() => setMapLoaded(true)}
      >
        <GoogleMap
          options={{
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: false, // Keep default UI or set to true if you want total custom control
            zoomControl: false, // We can hide default zoom if we want our own, or keep it. Let's keep it simple.
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={DEFAULT_MAP_CENTER}
          zoom={11}
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

