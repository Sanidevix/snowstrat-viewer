import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ParsedSnowProfile, SnowSample, GrainTypeLabel } from '@/types/snowProfile';
import { IACS_COLORS, HUMIDITY_CODES, GRAIN_TYPE_INFO } from '@/constants/iacs';
import { formatDateTime } from '@/utils/coordinates';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProfileDataTableProps {
  profile: ParsedSnowProfile;
}

// Calculate cumulative heights
const calculateCumulativeHeights = (samples: SnowSample[]) => {
  let cumulative = 0;
  return samples.map(sample => {
    cumulative += sample.height;
    return { ...sample, cumulativeHeight: cumulative };
  });
};

const ProfileDataTable: React.FC<ProfileDataTableProps> = ({ profile }) => {
  const { t, i18n } = useTranslation();
  const { samples } = profile.properties;

  const samplesWithCumulative = useMemo(
    () => calculateCumulativeHeights(samples),
    [samples]
  );

  // Get locale for time formatting
  const locale = i18n.language === 'en' ? 'en-US' : 
                 i18n.language === 'de' ? 'de-DE' : 
                 i18n.language === 'fr' ? 'fr-FR' : 
                 i18n.language === 'it' ? 'it-IT' : 'es-ES';

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t('table.title')}
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-center">{t('table.number')}</TableHead>
              <TableHead className="text-center">{t('table.height')}</TableHead>
              <TableHead className="text-center">{t('table.cumulative')}</TableHead>
              <TableHead className="text-center">{t('table.temperature')}</TableHead>
              <TableHead className="text-center">{t('table.resistance')}</TableHead>
              <TableHead className="text-center">{t('table.grainType')}</TableHead>
              <TableHead className="text-center">{t('table.diameter')}</TableHead>
              <TableHead className="text-center">{t('table.humidity')}</TableHead>
              <TableHead className="text-center">{t('table.time')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samplesWithCumulative.map((sample) => {
              const grainColor = IACS_COLORS[sample.grainTypeLabel as GrainTypeLabel] || '#888';
              const grainInfo = GRAIN_TYPE_INFO[sample.grainTypeLabel as GrainTypeLabel];
              const humidityLabel = sample.humidity ? HUMIDITY_CODES[sample.humidity] || sample.humidity : '-';

              return (
                <TableRow key={sample.id}>
                  <TableCell className="text-center font-mono text-xs">
                    {sample.number}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {sample.height}
                  </TableCell>
                  <TableCell className="text-center font-mono font-medium">
                    {sample.cumulativeHeight}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {sample.temperature !== null ? sample.temperature.toFixed(1) : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono">{sample.resistance}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({sample.resistanceLabel})
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center gap-1.5 cursor-help">
                          <div
                            className="w-3 h-3 rounded-sm border border-foreground/20"
                            style={{ backgroundColor: grainColor }}
                          />
                          <span className="font-mono font-medium">
                            {sample.grainTypeLabel}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-medium">{grainInfo?.name || sample.grainTypeLabel}</p>
                          {grainInfo?.description && (
                            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                              {grainInfo.description}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {sample.diameter !== null ? sample.diameter : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {sample.humidity ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono cursor-help">{sample.humidity}</span>
                        </TooltipTrigger>
                        <TooltipContent>{humidityLabel}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {new Date(sample.timestamp).toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ProfileDataTable;
