import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, User, Trash2, FileStack } from 'lucide-react';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { formatDate } from '@/utils/coordinates';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  profiles: ParsedSnowProfile[];
  selectedProfileId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  profiles,
  selectedProfileId,
  onSelect,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-3 py-3">
        <div className="flex items-center gap-2">
          <FileStack className="h-5 w-5 text-primary shrink-0" />
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
              {t('sidebar.importedProfiles')}
            </h2>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs text-muted-foreground px-3 pt-5 pb-2">
              {profiles.length} {profiles.length !== 1 ? t('header.profilesPlural') : t('header.profiles')}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            {profiles.length === 0 ? (
              <div className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                isCollapsed && "py-4 px-2"
              )}>
                <MapPin className={cn(
                  "text-muted-foreground/50 mb-4",
                  isCollapsed ? "h-6 w-6 mb-2" : "h-12 w-12"
                )} />
                {!isCollapsed && (
                  <>
                    <p className="text-muted-foreground text-sm">
                      {t('profileList.noProfiles')}
                    </p>
                    <p className="text-muted-foreground/70 text-xs mt-1">
                      {t('profileList.useImportButton')}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className={cn("space-y-2", isCollapsed ? "p-1" : "p-3")}>
                  {profiles.map((profile) => {
                    const isSelected = profile.id === selectedProfileId;
                    const { name, observer, timestamp, totalHeight, sampleCount } = profile.properties;
                    const altitude = profile.geometry.coordinates[2];

                    if (isCollapsed) {
                      return (
                        <Button
                          key={profile.id}
                          variant={isSelected ? "secondary" : "ghost"}
                          size="icon"
                          className={cn(
                            "w-full h-10",
                            isSelected && "bg-primary/10 border border-primary"
                          )}
                          onClick={() => onSelect(profile.id)}
                          title={name}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      );
                    }

                    return (
                      <div
                        key={profile.id}
                        className={cn(
                          'group relative rounded-lg border p-3 cursor-pointer transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
                        )}
                        onClick={() => onSelect(profile.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate text-sm">
                              {name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate">{observer}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span>{formatDate(timestamp)}</span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(profile.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="flex gap-3 mt-2 pt-2 border-t border-border/50 text-xs">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">{t('profileList.height')}</span>
                            <span className="font-mono font-medium text-foreground">{totalHeight} cm</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">{t('profileList.samples')}</span>
                            <span className="font-mono font-medium text-foreground">{sampleCount}</span>
                          </div>
                          {altitude > 0 && (
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">{t('profileList.altitude')}</span>
                              <span className="font-mono font-medium text-foreground">{Math.round(altitude)} m</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
