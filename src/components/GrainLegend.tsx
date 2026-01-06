import React from 'react';
import { GrainTypeLabel } from '@/types/snowProfile';
import { IACS_COLORS, GRAIN_TYPE_INFO } from '@/constants/iacs';

const GrainLegend: React.FC = () => {
  const grainTypes = Object.keys(IACS_COLORS) as GrainTypeLabel[];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        Leyenda IACS - Tipos de Grano
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {grainTypes.map(type => (
          <div
            key={type}
            className="flex items-center gap-2 text-xs"
          >
            <div
              className="w-4 h-4 rounded-sm border border-foreground/20 flex-shrink-0"
              style={{ backgroundColor: IACS_COLORS[type] }}
            />
            <div className="min-w-0">
              <span className="font-mono font-medium text-foreground">{type}</span>
              <span className="text-muted-foreground ml-1 truncate">
                - {GRAIN_TYPE_INFO[type]?.name || type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrainLegend;
