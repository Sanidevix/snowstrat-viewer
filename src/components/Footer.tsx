import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserManualModal from '@/components/UserManualModal';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [manualOpen, setManualOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-border bg-background">
        <div className="px-4 py-3 space-y-1 text-center text-xs text-muted-foreground">
          <p>
            SnowStrat Field © 2026 – {t('footer.license')}
          </p>
          <p className="flex items-center justify-center gap-1 flex-wrap">
            <span>PWA Offline-First</span>
            <span>•</span>
            <span>{t('footer.localData')}</span>
            <span>•</span>
            <button
              onClick={() => setManualOpen(true)}
              className="text-primary hover:underline font-medium"
            >
              {t('footer.userManual')}
            </button>
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
      <UserManualModal open={manualOpen} onClose={() => setManualOpen(false)} />
    </>
  );
};

export default Footer;
