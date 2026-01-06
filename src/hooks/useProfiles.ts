import { useState, useEffect, useCallback } from 'react';
import { ParsedSnowProfile, SnowProfile } from '@/types/snowProfile';
import { loadProfiles, addProfiles, removeProfile, clearAllProfiles } from '@/utils/localStorage';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<ParsedSnowProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles on mount
  useEffect(() => {
    const stored = loadProfiles();
    setProfiles(stored);
    setIsLoading(false);
  }, []);

  // Import new profiles from GeoJSON files
  const importProfiles = useCallback(async (files: FileList) => {
    const newProfiles: SnowProfile[] = [];

    for (const file of Array.from(files)) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Handle single feature or feature collection
        if (data.type === 'Feature') {
          newProfiles.push(data as SnowProfile);
        } else if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          newProfiles.push(...(data.features as SnowProfile[]));
        }
      } catch (error) {
        console.error(`Error parsing file ${file.name}:`, error);
      }
    }

    if (newProfiles.length > 0) {
      const updated = addProfiles(newProfiles);
      setProfiles(updated);
      
      // Auto-select first new profile if none selected
      if (!selectedProfileId && updated.length > 0) {
        setSelectedProfileId(updated[updated.length - 1].id);
      }
    }

    return newProfiles.length;
  }, [selectedProfileId]);

  // Delete a profile
  const deleteProfile = useCallback((id: string) => {
    const updated = removeProfile(id);
    setProfiles(updated);
    
    if (selectedProfileId === id) {
      setSelectedProfileId(updated.length > 0 ? updated[0].id : null);
    }
  }, [selectedProfileId]);

  // Clear all profiles
  const clearProfiles = useCallback(() => {
    clearAllProfiles();
    setProfiles([]);
    setSelectedProfileId(null);
  }, []);

  // Get selected profile
  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || null;

  return {
    profiles,
    selectedProfile,
    selectedProfileId,
    setSelectedProfileId,
    importProfiles,
    deleteProfile,
    clearProfiles,
    isLoading,
  };
};
