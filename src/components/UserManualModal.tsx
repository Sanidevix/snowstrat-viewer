import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserManualModalProps {
  open: boolean;
  onClose: () => void;
}

const UserManualModal: React.FC<UserManualModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm animate-fade-in">
      {/* Sticky header with close button */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">
            {t('manual.title')}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">{t('header.cancel')}</span>
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto h-[calc(100vh-65px)] scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-10">

          {/* Introducción */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.introTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('manual.introText')}
            </p>
          </section>

          {/* Flujo de trabajo */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.workflowTitle')}
            </h2>

            {/* Importación */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {t('manual.importTitle')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
                {(t('manual.importSteps', { returnObjects: true }) as string[]).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Visualización */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('manual.viewTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('manual.viewIntro')}
              </p>

              {/* Sub-secciones de visualización */}
              {(['metadata', 'map', 'chart', 'legend', 'dataTable', 'ctTable'] as const).map((section) => (
                <div key={section} className="pl-4 border-l-2 border-primary/20 space-y-1.5">
                  <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                    {t(`manual.view_${section}_title`)}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm leading-relaxed">
                    {(t(`manual.view_${section}_items`, { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* SnowAI */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {t('manual.aiTitle')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
                {(t('manual.aiSteps', { returnObjects: true }) as string[]).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground italic">
                {t('manual.aiDisclaimer')}
              </div>
            </div>
          </section>

          {/* Gestión de perfiles */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.managementTitle')}
            </h2>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {t('manual.sidebarTitle')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('manual.sidebarText')}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground leading-relaxed pl-2">
                {(t('manual.sidebarActions', { returnObjects: true }) as string[]).map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {t('manual.deleteAllTitle')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
                {(t('manual.deleteAllSteps', { returnObjects: true }) as string[]).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </section>

          {/* Idiomas */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.languageTitle')}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
              {(t('manual.languageSteps', { returnObjects: true }) as string[]).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {(t('manual.languageList', { returnObjects: true }) as string[]).map((lang, i) => (
                <div key={i} className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-1.5 text-center">
                  {lang}
                </div>
              ))}
            </div>
          </section>

          {/* Exportación PDF */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.exportTitle')}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed pl-2">
              {(t('manual.exportSteps', { returnObjects: true }) as string[]).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {/* Offline */}
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.offlineTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('manual.offlineText')}
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground leading-relaxed pl-2">
              {(t('manual.offlineItems', { returnObjects: true }) as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Info adicional */}
          <section className="space-y-3 pb-8">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              {t('manual.infoTitle')}
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground leading-relaxed pl-2">
              {(t('manual.infoItems', { returnObjects: true }) as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default UserManualModal;
