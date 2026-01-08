import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import ProfileList from '@/components/ProfileList';
import ProfileDashboard from '@/components/ProfileDashboard';
import { useProfiles } from '@/hooks/useProfiles';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const {
    profiles,
    selectedProfile,
    selectedProfileId,
    setSelectedProfileId,
    importProfiles,
    deleteProfile,
    clearProfiles,
  } = useProfiles();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onImport={importProfiles}
        onClearAll={clearProfiles}
        profileCount={profiles.length}
        selectedProfile={selectedProfile}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Profile List */}
        <aside className="w-80 border-r border-border bg-sidebar flex-shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-sidebar-foreground">
              {t('sidebar.importedProfiles')}
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProfileList
              profiles={profiles}
              selectedProfileId={selectedProfileId}
              onSelect={setSelectedProfileId}
              onDelete={deleteProfile}
            />
          </div>
        </aside>

        {/* Main Content - Dashboard */}
        <main className="flex-1 overflow-hidden bg-background">
          <ProfileDashboard profile={selectedProfile} />
        </main>
      </div>
    </div>
  );
};

export default Index;
