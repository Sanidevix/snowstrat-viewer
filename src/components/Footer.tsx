import React from 'react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="px-4 py-3 space-y-1 text-center text-xs text-muted-foreground">
        <p>
          SnowStrat Field © 2026 – Iván de Vicente Sánchez – {t('footer.license')}
        </p>
        <p className="flex items-center justify-center gap-1 flex-wrap">
          <span>PWA Offline-First</span>
          <span>•</span>
          <span>{t('footer.localData')}</span>
          <span>•</span>
          <a
            href="https://snowstrat-viewer.lovable.app/manual"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {t('footer.userManual')}
          </a>
          <span>•</span>
          <a
            href="https://snowstrat-viewer.lovable.app/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {t('footer.documentation')}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
