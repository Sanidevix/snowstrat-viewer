import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { formatDateTime } from '@/utils/coordinates';

// Fix Leaflet's default icon path issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

interface ProfileMapProps {
  profile: ParsedSnowProfile;
}

const ProfileMap: React.FC<ProfileMapProps> = ({ profile }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const { coordinates } = profile.geometry;
  const [longitude, latitude] = coordinates;
  const { name, observer, timestamp } = profile.properties;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker and fly to new location when profile changes
  useEffect(() => {
    if (!mapRef.current) return;

    const position: L.LatLngExpression = [latitude, longitude];

    // Remove previous marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add new marker
    const marker = L.marker(position, { icon: customIcon })
      .addTo(mapRef.current)
      .bindPopup(`
        <div style="min-width: 180px;">
          <h3 style="font-weight: 600; margin-bottom: 4px;">${name}</h3>
          <p style="font-size: 14px; color: #666; margin: 0;">Observador: ${observer}</p>
          <p style="font-size: 12px; color: #888; margin-top: 4px;">${formatDateTime(timestamp)}</p>
        </div>
      `);

    markerRef.current = marker;

    // Fly to new location
    mapRef.current.flyTo(position, 13, {
      duration: 1.5,
    });
  }, [latitude, longitude, name, observer, timestamp]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};

export default ProfileMap;
