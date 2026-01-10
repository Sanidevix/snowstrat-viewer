import React from 'react';
import { useTranslation } from 'react-i18next';
import { ParsedSnowProfile } from '@/types/snowProfile';
import ProfileMap from '@/components/ProfileMap';
import StratigraphicChart from '@/components/StratigraphicChart';
import ProfileMetadata from '@/components/ProfileMetadata';
import ProfileDataTable from '@/components/ProfileDataTable';
import CTDataTable from '@/components/CTDataTable';
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

  const hasCTSamples = profile.properties.ctSamples && profile.properties.ctSamples.length > 0;

  return (
    <div className="h-full overflow-auto p-4 space-y-4 animate-fade-in">
      {/* Row 1: Metadata + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-[280px]">
          <ProfileMetadata profile={profile} />
        </div>
        <div className="h-[280px]">
          <ProfileMap profile={profile} />
        </div>
      </div>

      {/* Row 2: Chart + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 h-[350px]">
          <StratigraphicChart profile={profile} />
        </div>
        <div className="lg:col-span-1">
          <GrainLegend />
        </div>
      </div>

      {/* Row 3: Sample Data + CT Test */}
      <div className={`grid grid-cols-1 gap-4 ${hasCTSamples ? 'lg:grid-cols-3' : ''}`}>
        <div className={`h-[300px] ${hasCTSamples ? 'lg:col-span-2' : ''}`}>
          <ProfileDataTable profile={profile} />
        </div>
        {hasCTSamples && (
          <div className="lg:col-span-1 h-[300px]">
            <CTDataTable profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
