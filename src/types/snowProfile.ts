// Snow profile types based on AEMET GeoJSON standard

export interface SnowSample {
  id: number;
  number: number;
  height: number; // Height of this layer in cm
  temperature: number | null; // Temperature in °C
  resistance: number; // Resistance value (0-120)
  resistanceLabel: string; // K, P, I, etc.
  grainType: number; // Grain type code
  grainTypeLabel: GrainTypeLabel; // PP, DF, RG, etc.
  diameter: number | null; // Grain diameter in mm
  humidity: string | null; // Humidity code (D, M, W, etc.)
  timestamp: string; // ISO timestamp
}

// CT (Compression Test) sample interface
export interface CTSample {
  id: number;
  number: number;
  taps: number;
  depth: number;
  fractureQuality: string; // Q1, Q2, Q3
  grainType: number;
  grainTypeLabel: GrainTypeLabel;
  diameter: number | null;
  additionalInfo: string | null;
  formattedResult: string; // Pre-formatted result string
  timestamp: string;
}

export type GrainTypeLabel = 'PP' | 'PPgp' | 'DF' | 'RG' | 'FC' | 'DH' | 'MF' | 'IF' | 'SH' | 'MFcr';

export interface SnowProfileProperties {
  name: string;
  observer: string;
  observations?: string;
  temperature?: number | null; // Ambient temperature in °C
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  totalHeight: number; // Total snow height in cm
  sampleCount: number;
  samples: SnowSample[];
  ctSampleCount?: number;
  ctSamples?: CTSample[];
}

export interface SnowProfileGeometry {
  type: 'Point';
  coordinates: [number, number, number]; // [longitude, latitude, altitude]
}

export interface SnowProfile {
  type: 'Feature';
  geometry: SnowProfileGeometry;
  properties: SnowProfileProperties;
}

// Parsed profile with additional metadata for the app
export interface ParsedSnowProfile extends SnowProfile {
  id: string; // Unique ID for the app
  importedAt: string; // When it was imported
}

// IACS color mapping for grain types
export const IACS_COLORS: Record<GrainTypeLabel, string> = {
  PP: '#00FF00', // Precipitation Particles
  PPgp: '#00FF00', // Precipitation Particles
  DF: '#228B22', // Decomposing and Fragmented
  RG: '#FFB6C1', // Rounded Grains
  FC: '#ADD8E6', // Faceted Crystals
  DH: '#0000FF', // Depth Hoar
  MF: '#FF0000', // Melt Forms
  MFcr: '#BDBDBD', // Costra de rehielo
  IF: '#8B0000', // Ice Formations
  SH: '#FF00FF', // Surface Hoar
};

// Grain type full names
export const GRAIN_TYPE_NAMES: Record<GrainTypeLabel, string> = {
  PP: '+ Nieve reciente',
  PPgp: '⛇ Nieve granulada',
  DF: '/ Partículas reconocibles',
  RG: '• Grano fino',
  FC: '□ Granos Caras planas',
  DH: '∧ Cubiletes',
  MF: '○ Grano redondo',
  MFcr: '⚭ Costra de rehielo',
  IF: '▮ Capa de hielo',
  SH: 'v Escarcha',
};

// Resistance labels and values
export const RESISTANCE_LABELS: Record<string, string> = {
  F: 'Fist (Very Soft)',
  '4F': '4 Fingers (Soft)',
  '1F': '1 Finger (Medium)',
  P: 'Pencil (Hard)',
  K: 'Knife (Very Hard)',
  I: 'Ice',
};
