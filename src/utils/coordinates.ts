// Coordinate conversion utilities

export type CoordinateFormat = 'decimal' | 'dms';

interface DMSCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

// Convert decimal degrees to DMS
export const decimalToDMS = (
  decimal: number,
  isLatitude: boolean
): DMSCoordinate => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesDecimal = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = (minutesDecimal - minutes) * 60;

  let direction: 'N' | 'S' | 'E' | 'W';
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  return { degrees, minutes, seconds, direction };
};

// Format DMS coordinate to string
export const formatDMS = (dms: DMSCoordinate): string => {
  return `${dms.degrees}° ${dms.minutes}' ${dms.seconds.toFixed(2)}" ${dms.direction}`;
};

// Format coordinates based on selected format
export const formatCoordinates = (
  longitude: number,
  latitude: number,
  format: CoordinateFormat
): { lat: string; lng: string } => {
  if (format === 'decimal') {
    return {
      lat: latitude.toFixed(6) + '°',
      lng: longitude.toFixed(6) + '°',
    };
  }

  const latDMS = decimalToDMS(latitude, true);
  const lngDMS = decimalToDMS(longitude, false);

  return {
    lat: formatDMS(latDMS),
    lng: formatDMS(lngDMS),
  };
};

// Format altitude
export const formatAltitude = (altitude: number): string => {
  return `${Math.round(altitude)} m`;
};

// Format date from ISO string
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date only
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
