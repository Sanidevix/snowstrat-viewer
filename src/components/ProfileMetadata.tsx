import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, User, Calendar, Mountain, ArrowLeftRight, Thermometer } from 'lucide-react';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { formatCoordinates, formatAltitude, formatDateTime, CoordinateFormat } from '@/utils/coordinates';
import { Button } from '@/components/ui/button';

interface ProfileMetadataProps {
  profile: ParsedSnowProfile;
}

const ProfileMetadata: React.FC<ProfileMetadataProps> = ({ profile }) => {
  const { t } = useTranslation();
  const [coordFormat, setCoordFormat] = useState<CoordinateFormat>('decimal');
  
  const { name, observer, timestamp, observations, temperature } = profile.properties;
  const [longitude, latitude, altitude] = profile.geometry.coordinates;

  const coords = formatCoordinates(longitude, latitude, coordFormat);

  const toggleCoordFormat = () => {
    setCoordFormat(prev => prev === 'decimal' ? 'dms' : 'decimal');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        {t('metadata.title')}
      </h3>

      <div className="flex-1 flex flex-col justify-between">
        {/* Row 1: Name | Observer */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Mountain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t('metadata.name')}</p>
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t('metadata.observer')}</p>
              <p className="text-sm font-medium text-foreground truncate">{observer}</p>
            </div>
          </div>
        </div>

        {/* Row 2: Date/Time | Temperature */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t('metadata.dateTime')}</p>
              <p className="text-sm font-medium text-foreground">{formatDateTime(timestamp)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t('metadata.temperature')}</p>
              <p className="text-sm font-mono font-medium text-foreground">
                {temperature != null ? `${temperature} °C` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Coordinates | Altitude */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs text-muted-foreground">{t('metadata.coordinates')}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCoordFormat}
                  className="h-4 px-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeftRight className="h-2.5 w-2.5 mr-0.5" />
                  {coordFormat === 'decimal' ? t('metadata.dms') : t('metadata.decimal')}
                </Button>
              </div>
              <div className="text-sm font-mono text-foreground leading-tight">
                <span>Lat: {coords.lat}</span>
                <br />
                <span>Lon: {coords.lng}</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mountain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t('metadata.altitude')}</p>
              <p className="text-sm font-mono font-medium text-foreground">
                {formatAltitude(altitude)}
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: Observations (full width) */}
        {observations && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">{t('metadata.observations')}</p>
            <p className="text-sm text-foreground">{observations}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMetadata;
