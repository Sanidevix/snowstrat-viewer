import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import ProfileDashboard from '@/components/ProfileDashboard';
import Footer from '@/components/Footer';
import { useProfiles } from '@/hooks/useProfiles';

const Index: React.FC = () => {
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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <Header
          onImport={importProfiles}
          onClearAll={clearProfiles}
          profileCount={profiles.length}
          selectedProfile={selectedProfile}
        />

        <div className="flex-1 flex w-full overflow-hidden">
          <AppSidebar
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelect={setSelectedProfileId}
            onDelete={deleteProfile}
          />

          {/* Main Content - Dashboard */}
          <main className="flex-1 overflow-hidden bg-background relative">
            {/* Mobile Sidebar Trigger */}
            <div className="absolute top-2 left-2 z-10 md:hidden">
              <SidebarTrigger />
            </div>
            <ProfileDashboard profile={selectedProfile} />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Index;
