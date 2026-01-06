import React from 'react';
import { MapPin, Calendar, User, Trash2 } from 'lucide-react';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { formatDate } from '@/utils/coordinates';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ProfileListProps {
  profiles: ParsedSnowProfile[];
  selectedProfileId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  selectedProfileId,
  onSelect,
  onDelete,
}) => {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-sm">
          No hay perfiles importados
        </p>
        <p className="text-muted-foreground/70 text-xs mt-1">
          Usa el botón "Importar GeoJSON" para comenzar
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {profiles.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          const { name, observer, timestamp, totalHeight, sampleCount } = profile.properties;
          const altitude = profile.geometry.coordinates[2];

          return (
            <div
              key={profile.id}
              className={cn(
                'group relative rounded-lg border p-3 cursor-pointer transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
              )}
              onClick={() => onSelect(profile.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{observer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(timestamp)}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(profile.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex gap-3 mt-2 pt-2 border-t border-border/50 text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Altura</span>
                  <span className="font-mono font-medium text-foreground">{totalHeight} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Muestras</span>
                  <span className="font-mono font-medium text-foreground">{sampleCount}</span>
                </div>
                {altitude > 0 && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Altitud</span>
                    <span className="font-mono font-medium text-foreground">{Math.round(altitude)} m</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ProfileList;
