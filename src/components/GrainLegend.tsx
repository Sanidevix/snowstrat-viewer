import React from 'react';
import { useTranslation } from 'react-i18next';
import { GrainTypeLabel } from '@/types/snowProfile';
import { IACS_COLORS, GRAIN_TYPE_INFO } from '@/constants/iacs';

const GrainLegend: React.FC = () => {
  const { t } = useTranslation();
  const grainTypes = Object.keys(IACS_COLORS) as GrainTypeLabel[];

  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        {t('legend.title')}
      </h3>

      <div className="flex flex-col gap-2 flex-1">
        {grainTypes.map(type => (
          <div
            key={type}
            className="flex items-center gap-2 text-xs"
          >
            <div
              className="w-4 h-4 rounded-sm border border-foreground/20 flex-shrink-0"
              style={{ backgroundColor: IACS_COLORS[type] }}
            />
            <div className="min-w-0 flex items-center">
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
