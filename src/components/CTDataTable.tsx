import React from 'react';
import { useTranslation } from 'react-i18next';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CTDataTableProps {
  profile: ParsedSnowProfile;
}

const CTDataTable: React.FC<CTDataTableProps> = ({ profile }) => {
  const { t } = useTranslation();
  const ctSamples = profile.properties.ctSamples || [];

  if (ctSamples.length === 0) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          {t('ctTable.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center">{t('table.number')}</TableHead>
                <TableHead>{t('ctTable.result')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ctSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="text-center font-medium">
                    {sample.number}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {sample.formattedResult}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CTDataTable;
