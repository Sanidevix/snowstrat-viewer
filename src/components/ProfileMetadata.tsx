import React, { useState } from 'react';
import { MapPin, User, Calendar, Mountain, ArrowLeftRight } from 'lucide-react';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { formatCoordinates, formatAltitude, formatDateTime, CoordinateFormat } from '@/utils/coordinates';
import { Button } from '@/components/ui/button';

interface ProfileMetadataProps {
  profile: ParsedSnowProfile;
}

const ProfileMetadata: React.FC<ProfileMetadataProps> = ({ profile }) => {
  const [coordFormat, setCoordFormat] = useState<CoordinateFormat>('decimal');
  
  const { name, observer, timestamp, observations, totalHeight, sampleCount } = profile.properties;
  const [longitude, latitude, altitude] = profile.geometry.coordinates;

  const coords = formatCoordinates(longitude, latitude, coordFormat);

  const toggleCoordFormat = () => {
    setCoordFormat(prev => prev === 'decimal' ? 'dms' : 'decimal');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        Metadatos del Perfil
      </h3>

      <div className="space-y-3">
        {/* Profile Name */}
        <div className="flex items-start gap-3">
          <Mountain className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Nombre</p>
            <p className="text-sm font-medium text-foreground">{name}</p>
          </div>
        </div>

        {/* Observer */}
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Observador</p>
            <p className="text-sm font-medium text-foreground">{observer}</p>
          </div>
        </div>

        {/* Date/Time */}
        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Fecha y Hora</p>
            <p className="text-sm font-medium text-foreground">{formatDateTime(timestamp)}</p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Coordenadas</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCoordFormat}
                className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftRight className="h-3 w-3 mr-1" />
                {coordFormat === 'decimal' ? 'GMS' : 'Decimal'}
              </Button>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-mono text-foreground">Lat: {coords.lat}</p>
              <p className="text-sm font-mono text-foreground">Lon: {coords.lng}</p>
            </div>
          </div>
        </div>

        {/* Altitude */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Altitud</span>
            <span className="text-sm font-mono font-medium text-foreground">
              {formatAltitude(altitude)}
            </span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Altura Total</p>
            <p className="text-sm font-mono font-medium text-foreground">{totalHeight} cm</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Muestras</p>
            <p className="text-sm font-mono font-medium text-foreground">{sampleCount}</p>
          </div>
        </div>

        {/* Observations */}
        {observations && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Observaciones</p>
            <p className="text-sm text-foreground">{observations}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMetadata;
