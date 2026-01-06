// IACS (International Classification for Seasonal Snow on the Ground) constants

import { GrainTypeLabel } from '@/types/snowProfile';

// IACS standard colors for grain types
export const IACS_COLORS: Record<GrainTypeLabel, string> = {
  PP: '#00FF00', // Precipitation Particles - Bright Green
  DF: '#228B22', // Decomposing and Fragmented - Forest Green
  RG: '#FFB6C1', // Rounded Grains - Light Pink
  FC: '#ADD8E6', // Faceted Crystals - Light Blue
  DH: '#0000FF', // Depth Hoar - Blue
  MF: '#FF0000', // Melt Forms - Red
  IF: '#8B0000', // Ice Formations - Dark Red
  SH: '#FF00FF', // Surface Hoar - Magenta
  GP: '#FFFF00', // Graupel - Yellow
};

// Grain type descriptions
export const GRAIN_TYPE_INFO: Record<GrainTypeLabel, { name: string; description: string }> = {
  PP: {
    name: 'Partículas de Precipitación',
    description: 'Cristales de nieve recién caída, conservan su forma original',
  },
  DF: {
    name: 'Fragmentados/Descompuestos',
    description: 'Cristales parcialmente descompuestos o fragmentados',
  },
  RG: {
    name: 'Granos Redondeados',
    description: 'Granos pequeños y redondeados, típicos de nieve vieja',
  },
  FC: {
    name: 'Cristales Facetados',
    description: 'Cristales con caras planas, formados por gradiente de temperatura',
  },
  DH: {
    name: 'Escarcha de Profundidad',
    description: 'Cristales grandes en forma de copa, muy débiles',
  },
  MF: {
    name: 'Formas de Fusión',
    description: 'Granos afectados por ciclos de fusión-rehielo',
  },
  IF: {
    name: 'Formaciones de Hielo',
    description: 'Capas o costras de hielo',
  },
  SH: {
    name: 'Escarcha Superficial',
    description: 'Cristales formados en la superficie por sublimación',
  },
  GP: {
    name: 'Granizo Blando',
    description: 'Partículas esféricas opacas, tipo granizo pequeño',
  },
};

// Resistance scale values (Newton scale)
export const RESISTANCE_SCALE = {
  min: 0,
  max: 120,
  ticks: [0, 20, 40, 60, 80, 100, 120],
};

// Temperature scale values
export const TEMPERATURE_SCALE = {
  min: -24,
  max: 0,
  ticks: [-24, -20, -16, -12, -8, -4, 0],
};

// Height scale values
export const HEIGHT_SCALE = {
  min: 0,
  max: 200,
  step: 20,
};

// Humidity codes
export const HUMIDITY_CODES: Record<string, string> = {
  D: 'Seco',
  M: 'Húmedo',
  W: 'Mojado',
  V: 'Muy mojado',
  S: 'Saturado',
};
