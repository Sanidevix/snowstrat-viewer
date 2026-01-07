import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Mountain, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';

interface HeaderProps {
  onImport: (files: FileList) => Promise<number>;
  onClearAll: () => void;
  profileCount: number;
}

const Header: React.FC<HeaderProps> = ({ onImport, onClearAll, profileCount }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const count = await onImport(files);
    
    if (count > 0) {
      toast({
        title: t('toast.importedTitle'),
        description: t('toast.importedDescription', { count }),
      });
    } else {
      toast({
        title: t('toast.noNewTitle'),
        description: t('toast.noNewDescription'),
        variant: 'destructive',
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Mountain className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-tight text-foreground">
              {t('header.title')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('header.subtitle')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {profileCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {profileCount} {profileCount !== 1 ? t('header.profilesPlural') : t('header.profiles')}
            </span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('header.importButton')}
          </Button>

          <LanguageSelector />

          {profileCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('header.deleteAllTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('header.deleteAllDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('header.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t('header.deleteAll')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
