import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { generateSnowProfilePDF, getPDFTranslations } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface ExportPDFButtonProps {
  profile: ParsedSnowProfile | null;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  profile,
  variant = 'outline',
  size = 'default',
}) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!profile) return;

    setIsExporting(true);
    try {
      const translations = getPDFTranslations(i18n.language);
      await generateSnowProfilePDF({
        profile,
        language: i18n.language,
        translations,
      });

      toast({
        title: t('export.successTitle'),
        description: t('export.successDescription'),
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: t('export.errorTitle'),
        description: t('export.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={!profile || isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{t('export.pdf')}</span>
    </Button>
  );
};

export default ExportPDFButton;
