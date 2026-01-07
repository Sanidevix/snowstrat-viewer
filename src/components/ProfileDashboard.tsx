import React from 'react';
import { useTranslation } from 'react-i18next';
import { ParsedSnowProfile } from '@/types/snowProfile';
import ProfileMap from '@/components/ProfileMap';
import StratigraphicChart from '@/components/StratigraphicChart';
import ProfileMetadata from '@/components/ProfileMetadata';
import ProfileDataTable from '@/components/ProfileDataTable';
import GrainLegend from '@/components/GrainLegend';
import { Snowflake } from 'lucide-react';

interface ProfileDashboardProps {
  profile: ParsedSnowProfile | null;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ profile }) => {
  const { t } = useTranslation();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Snowflake className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t('dashboard.selectProfile')}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {t('dashboard.selectProfileDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 space-y-4 animate-fade-in">
      {/* Top row: Map and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Section A: Map */}
        <div className="h-[350px]">
          <ProfileMap profile={profile} />
        </div>

        {/* Section B: Stratigraphic Chart */}
        <div className="h-[350px]">
          <StratigraphicChart profile={profile} />
        </div>
      </div>

      {/* Legend */}
      <GrainLegend />

      {/* Bottom row: Metadata and Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Section C: Metadata */}
        <div className="lg:col-span-1">
          <ProfileMetadata profile={profile} />
        </div>

        {/* Section D: Data Table */}
        <div className="lg:col-span-2 h-[300px]">
          <ProfileDataTable profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
