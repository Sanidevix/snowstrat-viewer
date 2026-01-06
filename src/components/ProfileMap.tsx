import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { formatDateTime } from '@/utils/coordinates';

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom marker icon with alpine blue color
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="hsl(215, 65%, 35%)"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map flyTo
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  const prevCenter = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (
      !prevCenter.current ||
      prevCenter.current[0] !== center[0] ||
      prevCenter.current[1] !== center[1]
    ) {
      map.flyTo(center, 13, {
        duration: 1.5,
      });
      prevCenter.current = center;
    }
  }, [center, map]);

  return null;
};

interface ProfileMapProps {
  profile: ParsedSnowProfile;
}

const ProfileMap: React.FC<ProfileMapProps> = ({ profile }) => {
  const { coordinates } = profile.geometry;
  const [longitude, latitude] = coordinates;
  const { name, observer, timestamp } = profile.properties;

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={position}
        zoom={13}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="min-w-[180px]">
              <h3 className="font-semibold text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">
                Observador: {observer}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDateTime(timestamp)}
              </p>
            </div>
          </Popup>
        </Marker>
        <MapController center={position} />
      </MapContainer>
    </div>
  );
};

export default ProfileMap;
