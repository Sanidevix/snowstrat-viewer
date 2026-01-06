import { ParsedSnowProfile, SnowProfile } from '@/types/snowProfile';

const STORAGE_KEY = 'snowstrat_profiles';

// Generate unique ID for profile
export const generateProfileId = (profile: SnowProfile): string => {
  const { name, timestamp } = profile.properties;
  const coords = profile.geometry.coordinates;
  return `${name}_${timestamp}_${coords[0]}_${coords[1]}`.replace(/[^a-zA-Z0-9_-]/g, '_');
};

// Load all profiles from localStorage
export const loadProfiles = (): ParsedSnowProfile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading profiles from localStorage:', error);
    return [];
  }
};

// Save profiles to localStorage
export const saveProfiles = (profiles: ParsedSnowProfile[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving profiles to localStorage:', error);
  }
};

// Add new profiles (avoids duplicates by ID)
export const addProfiles = (newProfiles: SnowProfile[]): ParsedSnowProfile[] => {
  const existing = loadProfiles();
  const existingIds = new Set(existing.map(p => p.id));
  
  const parsed: ParsedSnowProfile[] = newProfiles
    .map(profile => ({
      ...profile,
      id: generateProfileId(profile),
      importedAt: new Date().toISOString(),
    }))
    .filter(p => !existingIds.has(p.id));

  const updated = [...existing, ...parsed];
  saveProfiles(updated);
  return updated;
};

// Remove a profile by ID
export const removeProfile = (id: string): ParsedSnowProfile[] => {
  const profiles = loadProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
  return profiles;
};

// Clear all profiles
export const clearAllProfiles = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
