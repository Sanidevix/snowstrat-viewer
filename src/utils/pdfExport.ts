import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ParsedSnowProfile, SnowSample, GrainTypeLabel, IACS_COLORS } from '@/types/snowProfile';
import { GRAIN_TYPE_INFO, HUMIDITY_CODES } from '@/constants/iacs';
import { formatCoordinates, formatAltitude } from '@/utils/coordinates';
import { getLogoBase64 } from '@/assets/logoBase64';

// IACS grain symbols as SVG paths
const GRAIN_SYMBOLS: Record<GrainTypeLabel, string> = {
  PP: 'M12,2 L12,22 M2,12 L22,12 M4,4 L20,20 M20,4 L4,20', // Star/precipitation
  DF: 'M6,6 L18,6 L18,18 L6,18 Z M8,8 L16,16 M16,8 L8,16', // Fragmented
  RG: 'M12,2 A10,10 0 1,0 12,22 A10,10 0 1,0 12,2', // Circle
  FC: 'M12,2 L22,12 L12,22 L2,12 Z', // Diamond/facet
  DH: 'M12,2 L18,8 L18,16 L12,22 L6,16 L6,8 Z', // Cup/hexagon
  MF: 'M12,2 A10,10 0 1,0 12,22 A10,10 0 1,0 12,2 M7,12 A5,5 0 1,0 17,12', // Double circle
  IF: 'M2,2 L22,2 L22,22 L2,22 Z', // Solid rectangle
  SH: 'M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z', // Star
  GP: 'M12,2 A10,10 0 1,0 12,22 A10,10 0 1,0 12,2 M8,8 L16,16 M16,8 L8,16', // Circle with X
};

// Hardness scale labels
const HARDNESS_LABELS: Record<string, { label: string; symbol: string }> = {
  F: { label: 'Puño', symbol: '👊' },
  '4F': { label: '4 Dedos', symbol: '🖐️' },
  '1F': { label: '1 Dedo', symbol: '☝️' },
  P: { label: 'Lápiz', symbol: '✏️' },
  K: { label: 'Cuchillo', symbol: '🔪' },
  I: { label: 'Hielo', symbol: '🧊' },
};

// Orientation directions
const ORIENTATIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

interface PDFExportOptions {
  profile: ParsedSnowProfile;
  language?: string;
  translations: {
    title: string;
    location: string;
    altitude: string;
    orientation: string;
    date: string;
    time: string;
    airTemp: string;
    weather: string;
    observations: string;
    observer: string;
    layerLimits: string;
    grainType: string;
    size: string;
    hardness: string;
    humidity: string;
    density: string;
    resistance: string;
    temperature: string;
    height: string;
    stabilityTests: string;
    stratigraphicProfile: string;
    soundingChart: string;
    tempProfile: string;
    layerTable: string;
    generatedWith: string;
    page: string;
  };
}

// Helper to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [128, 128, 128];
};

// Calculate cumulative heights
const calculateLayerData = (samples: SnowSample[]) => {
  let cumulative = 0;
  return samples.map(sample => {
    const prevCumulative = cumulative;
    cumulative += sample.height;
    return {
      ...sample,
      cumulativeHeight: cumulative,
      prevCumulativeHeight: prevCumulative,
      midpoint: prevCumulative + sample.height / 2,
    };
  });
};

export const generateSnowProfilePDF = async (options: PDFExportOptions): Promise<void> => {
  const { profile, translations: t } = options;
  const { properties, geometry } = profile;
  const { samples, totalHeight, name, observer, observations, timestamp } = properties;
  const [lon, lat, alt] = geometry.coordinates;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Colors
  const primaryColor: [number, number, number] = [26, 74, 140]; // Header blue
  const textColor: [number, number, number] = [40, 40, 40];
  const lightGray: [number, number, number] = [240, 240, 240];
  const tempLineColor: [number, number, number] = [220, 38, 38]; // Red for temperature

  let currentY = margin;

  // === HEADER SECTION ===
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 28, 'F');

  // Add logo
  try {
    const logoData = await getLogoBase64();
    if (logoData) {
      pdf.addImage(logoData, 'PNG', margin, 4, 20, 20);
    }
  } catch (e) {
    console.log('Could not add logo to PDF');
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(t.stratigraphicProfile, margin + 25, 12);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('SnowStrat Viewer', margin + 25, 19);

  currentY = 34;

  // === METADATA SECTION ===
  pdf.setTextColor(...textColor);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');

  // Location and date info
  const dateObj = new Date(timestamp);
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const coordsDecimal = formatCoordinates(lat, lon, 'decimal');
  const coordsDMS = formatCoordinates(lat, lon, 'dms');
  const coordsDecimalStr = `${coordsDecimal.lat}, ${coordsDecimal.lng}`;
  const coordsDMSStr = `${coordsDMS.lat}, ${coordsDMS.lng}`;
  const altitudeStr = formatAltitude(alt);

  // Metadata table with tighter spacing
  autoTable(pdf, {
    startY: currentY,
    head: [],
    body: [
      [
        { content: t.location, styles: { fontStyle: 'bold' } },
        name || coordsDecimalStr,
        { content: t.altitude, styles: { fontStyle: 'bold' } },
        altitudeStr,
      ],
      [
        { content: 'Coordenadas', styles: { fontStyle: 'bold' } },
        coordsDMSStr,
        { content: t.orientation, styles: { fontStyle: 'bold' } },
        '—',
      ],
      [
        { content: t.date, styles: { fontStyle: 'bold' } },
        formattedDate,
        { content: t.time, styles: { fontStyle: 'bold' } },
        formattedTime,
      ],
      [
        { content: t.observer, styles: { fontStyle: 'bold' } },
        observer || '—',
        { content: t.airTemp, styles: { fontStyle: 'bold' } },
        samples[samples.length - 1]?.temperature !== null
          ? `${samples[samples.length - 1].temperature}°C`
          : '—',
      ],
    ],
    theme: 'plain',
    styles: { fontSize: 7, cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: contentWidth / 2 - 22 },
      2: { cellWidth: 22 },
      3: { cellWidth: contentWidth / 2 - 22 },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (pdf as any).lastAutoTable.finalY + 2;

  // Weather observations
  if (observations) {
    pdf.setFillColor(...lightGray);
    pdf.rect(margin, currentY, contentWidth, 15, 'F');
    pdf.setTextColor(...textColor);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${t.weather} / ${t.observations}:`, margin + 3, currentY + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(observations.substring(0, 200), margin + 3, currentY + 11);
    currentY += 18;
  }

  currentY += 5;

  // === COMBINED CHART SECTION (Chart + Legend side by side) ===
  const chartHeight = 110;
  const chartWidth = contentWidth * 0.62;
  const chartX = margin;
  const legendX = margin + chartWidth + 18;

  const chartStartY = currentY + 8;

  // Draw chart background
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(252, 252, 252);
  pdf.rect(chartX, chartStartY, chartWidth, chartHeight, 'FD');

  // Calculate scales
  const maxHeight = Math.max(200, totalHeight);
  const maxResistance = 120;
  const minTemp = -24;
  const maxTemp = 0;

  const layerData = calculateLayerData(samples);

  // Y scale (height)
  const yScale = (h: number) => chartStartY + chartHeight - (h / maxHeight) * chartHeight;
  // X scale for resistance (120 on left, 0 on right)
  const resistanceScale = (r: number) => chartX + ((maxResistance - r) / maxResistance) * chartWidth;
  // X scale for temperature
  const tempScale = (temp: number) => chartX + ((temp - minTemp) / (maxTemp - minTemp)) * chartWidth;

  // Draw grid lines
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.1);
  for (let h = 0; h <= maxHeight; h += 20) {
    const y = yScale(h);
    pdf.line(chartX, y, chartX + chartWidth, y);
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${h}`, chartX + chartWidth + 2, y + 1);
  }

  // Draw resistance bars with IACS colors
  layerData.forEach(sample => {
    const y1 = yScale(sample.prevCumulativeHeight);
    const y2 = yScale(sample.cumulativeHeight);
    const barHeight = y1 - y2;
    const barStartX = resistanceScale(sample.resistance);
    const barEndX = chartX + chartWidth;
    const barWidth = barEndX - barStartX;

    const color = hexToRgb(IACS_COLORS[sample.grainTypeLabel as GrainTypeLabel] || '#888888');

    pdf.setFillColor(...color);
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.2);
    pdf.rect(barStartX, y2, barWidth, barHeight, 'FD');

    // Add grain type label if space allows
    if (barHeight > 5 && barWidth > 10) {
      pdf.setFontSize(6);
      pdf.setTextColor(0, 0, 0);
      pdf.text(sample.grainTypeLabel, barStartX + 2, y2 + barHeight / 2 + 1);
    }
  });

  // Draw temperature line
  const tempPoints = layerData.filter(s => s.temperature !== null);
  if (tempPoints.length > 1) {
    pdf.setDrawColor(...tempLineColor);
    pdf.setLineWidth(0.5);
    for (let i = 1; i < tempPoints.length; i++) {
      const prev = tempPoints[i - 1];
      const curr = tempPoints[i];
      pdf.line(
        tempScale(prev.temperature!),
        yScale(prev.midpoint),
        tempScale(curr.temperature!),
        yScale(curr.midpoint)
      );
    }
    // Draw temperature points
    tempPoints.forEach(point => {
      pdf.setFillColor(...tempLineColor);
      pdf.circle(tempScale(point.temperature!), yScale(point.midpoint), 1, 'F');
    });
  }

  // Axis labels
  pdf.setFontSize(7);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${t.resistance} (N)`, chartX + chartWidth / 2, chartStartY + chartHeight + 8, {
    align: 'center',
  });
  pdf.text(`${t.height} (cm)`, chartX + chartWidth + 8, chartStartY + chartHeight / 2, {
    angle: 90,
  });

  // Temperature axis label
  pdf.setTextColor(...tempLineColor);
  pdf.text(`${t.temperature} (°C)`, chartX + chartWidth / 2, chartStartY - 2, { align: 'center' });

  // Resistance scale labels
  pdf.setFontSize(6);
  pdf.setTextColor(100, 100, 100);
  [120, 90, 60, 30, 0].forEach(r => {
    pdf.text(`${r}`, resistanceScale(r), chartStartY + chartHeight + 4, { align: 'center' });
  });

  // Temperature scale labels
  [-24, -18, -12, -6, 0].forEach(temp => {
    pdf.text(`${temp}`, tempScale(temp), chartStartY - 4, { align: 'center' });
  });

  // === IACS LEGEND (Right side of chart) ===
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...textColor);
  pdf.text('Leyenda IACS:', legendX, chartStartY + 3);

  let legendItemY = chartStartY + 8;
  const legendItemHeight = 6;

  (Object.keys(IACS_COLORS) as GrainTypeLabel[]).forEach((grainType) => {
    const color = hexToRgb(IACS_COLORS[grainType]);
    const info = GRAIN_TYPE_INFO[grainType];

    pdf.setFillColor(...color);
    pdf.rect(legendX, legendItemY, 4, 4, 'F');
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...textColor);
    pdf.text(`${grainType}: ${info?.name || grainType}`, legendX + 6, legendItemY + 3);

    legendItemY += legendItemHeight;
  });

  currentY = chartStartY + chartHeight + 15;

  // === STRATIGRAPHIC TABLE (Full width at bottom) ===
  const tableData = layerData.map(sample => {
    const humidityLabel = sample.humidity ? HUMIDITY_CODES[sample.humidity] || sample.humidity : '—';
    // Use same format as web table: resistance value + label in parentheses
    const hardnessDisplay = `${sample.resistance} (${sample.resistanceLabel})`;

    return [
      `${sample.prevCumulativeHeight}-${sample.cumulativeHeight}`,
      sample.grainTypeLabel,
      sample.diameter ? `${sample.diameter}` : '—',
      hardnessDisplay,
      humidityLabel,
      '—', // Density placeholder
    ];
  });

  autoTable(pdf, {
    startY: currentY,
    head: [[t.layerLimits, t.grainType, t.size, t.hardness, t.humidity, t.density]],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 7, cellPadding: 1.5, valign: 'middle' },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.14 },
      1: { cellWidth: contentWidth * 0.12, halign: 'center' },
      2: { cellWidth: contentWidth * 0.10, halign: 'center' },
      3: { cellWidth: contentWidth * 0.20 },
      4: { cellWidth: contentWidth * 0.22 },
      5: { cellWidth: contentWidth * 0.12, halign: 'center' },
    },
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
    didDrawCell: (data: any) => {
      // Draw IACS color indicator for grain type column
      if (data.section === 'body' && data.column.index === 1) {
        const grainType = data.cell.raw as GrainTypeLabel;
        if (IACS_COLORS[grainType]) {
          const color = hexToRgb(IACS_COLORS[grainType]);
          pdf.setFillColor(...color);
          pdf.rect(data.cell.x + 1, data.cell.y + 1, 3, data.cell.height - 2, 'F');
        }
      }
    },
  });

  currentY = (pdf as any).lastAutoTable.finalY + 5;

  // === CT TESTS TABLE (if available) ===
  const ctSamples = properties.ctSamples || [];
  
  if (ctSamples.length > 0) {
    if (currentY + 40 > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...textColor);
    pdf.text('Test de Compresión (CT)', margin, currentY + 5);
    currentY += 8;

    const ctTableData = ctSamples.map(sample => [
      sample.number.toString(),
      sample.formattedResult,
    ]);

    autoTable(pdf, {
      startY: currentY,
      head: [['#', 'Resultado']],
      body: ctTableData,
      theme: 'striped',
      styles: { fontSize: 7, cellPadding: 1.5, valign: 'middle' },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: contentWidth - 15 },
      },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
    });

    currentY = (pdf as any).lastAutoTable.finalY + 5;
  }

  // === STABILITY TESTS SECTION (placeholder for other tests) ===
  if (currentY + 30 > pageHeight - margin) {
    pdf.addPage();
    currentY = margin;
  }

  pdf.setFillColor(...lightGray);
  pdf.rect(margin, currentY, contentWidth, 20, 'F');
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...textColor);
  pdf.text(t.stabilityTests, margin + 3, currentY + 6);

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('ECT (Extended Column Test): ___________________________________________', margin + 3, currentY + 13);

  currentY += 25;

  // === FOOTER ===
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    `${t.generatedWith} SnowStrat Viewer | ${new Date().toLocaleDateString('es-ES')} | ${t.page} 1`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Save PDF
  const fileName = `perfil-nivologico-${name?.replace(/\s+/g, '-') || 'export'}-${formattedDate.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
};

// Default Spanish translations for PDF
export const getPDFTranslations = (lang: string) => {
  const translations: Record<string, PDFExportOptions['translations']> = {
    es: {
      title: 'Perfil Estratigráfico',
      location: 'Lugar',
      altitude: 'Altitud',
      orientation: 'Orientación',
      date: 'Fecha',
      time: 'Hora (UTC)',
      airTemp: 'Temp. Aire',
      weather: 'Tiempo Presente',
      observations: 'Observaciones',
      observer: 'Observador',
      layerLimits: 'Niveles (cm)',
      grainType: 'Tipo Grano',
      size: 'Ø (mm)',
      hardness: 'Dureza',
      humidity: 'Humedad',
      density: 'Densidad',
      resistance: 'Resistencia',
      temperature: 'Temperatura',
      height: 'Altura',
      stabilityTests: 'Tests de Estabilidad',
      stratigraphicProfile: 'Hoja de Perfil Estratigráfico y Sondeo',
      soundingChart: 'Gráfico de Sondeo por Golpeo',
      tempProfile: 'Perfil de Temperaturas',
      layerTable: 'Tabla Estratigráfica',
      generatedWith: 'Generado con',
      page: 'Página',
    },
    en: {
      title: 'Stratigraphic Profile',
      location: 'Location',
      altitude: 'Altitude',
      orientation: 'Orientation',
      date: 'Date',
      time: 'Time (UTC)',
      airTemp: 'Air Temp.',
      weather: 'Present Weather',
      observations: 'Observations',
      observer: 'Observer',
      layerLimits: 'Levels (cm)',
      grainType: 'Grain Type',
      size: 'Ø (mm)',
      hardness: 'Hardness',
      humidity: 'Humidity',
      density: 'Density',
      resistance: 'Resistance',
      temperature: 'Temperature',
      height: 'Height',
      stabilityTests: 'Stability Tests',
      stratigraphicProfile: 'Stratigraphic Profile and Sounding Sheet',
      soundingChart: 'Ram Sounding Chart',
      tempProfile: 'Temperature Profile',
      layerTable: 'Stratigraphic Table',
      generatedWith: 'Generated with',
      page: 'Page',
    },
    fr: {
      title: 'Profil Stratigraphique',
      location: 'Lieu',
      altitude: 'Altitude',
      orientation: 'Orientation',
      date: 'Date',
      time: 'Heure (UTC)',
      airTemp: 'Temp. Air',
      weather: 'Temps Présent',
      observations: 'Observations',
      observer: 'Observateur',
      layerLimits: 'Niveaux (cm)',
      grainType: 'Type Grain',
      size: 'Ø (mm)',
      hardness: 'Dureté',
      humidity: 'Humidité',
      density: 'Densité',
      resistance: 'Résistance',
      temperature: 'Température',
      height: 'Hauteur',
      stabilityTests: 'Tests de Stabilité',
      stratigraphicProfile: 'Feuille de Profil Stratigraphique et Sondage',
      soundingChart: 'Graphique de Sondage par Battage',
      tempProfile: 'Profil de Températures',
      layerTable: 'Tableau Stratigraphique',
      generatedWith: 'Généré avec',
      page: 'Page',
    },
    de: {
      title: 'Stratigraphisches Profil',
      location: 'Standort',
      altitude: 'Höhe',
      orientation: 'Exposition',
      date: 'Datum',
      time: 'Uhrzeit (UTC)',
      airTemp: 'Lufttemp.',
      weather: 'Aktuelles Wetter',
      observations: 'Beobachtungen',
      observer: 'Beobachter',
      layerLimits: 'Schichten (cm)',
      grainType: 'Kornform',
      size: 'Ø (mm)',
      hardness: 'Härte',
      humidity: 'Feuchtigkeit',
      density: 'Dichte',
      resistance: 'Widerstand',
      temperature: 'Temperatur',
      height: 'Höhe',
      stabilityTests: 'Stabilitätstests',
      stratigraphicProfile: 'Stratigraphisches Profil und Sondierungsblatt',
      soundingChart: 'Rammsondierungsdiagramm',
      tempProfile: 'Temperaturprofil',
      layerTable: 'Stratigraphische Tabelle',
      generatedWith: 'Erstellt mit',
      page: 'Seite',
    },
    it: {
      title: 'Profilo Stratigrafico',
      location: 'Luogo',
      altitude: 'Altitudine',
      orientation: 'Esposizione',
      date: 'Data',
      time: 'Ora (UTC)',
      airTemp: 'Temp. Aria',
      weather: 'Tempo Presente',
      observations: 'Osservazioni',
      observer: 'Osservatore',
      layerLimits: 'Livelli (cm)',
      grainType: 'Tipo Grano',
      size: 'Ø (mm)',
      hardness: 'Durezza',
      humidity: 'Umidità',
      density: 'Densità',
      resistance: 'Resistenza',
      temperature: 'Temperatura',
      height: 'Altezza',
      stabilityTests: 'Test di Stabilità',
      stratigraphicProfile: 'Scheda Profilo Stratigrafico e Sondaggio',
      soundingChart: 'Grafico Sondaggio a Percussione',
      tempProfile: 'Profilo Termico',
      layerTable: 'Tabella Stratigrafica',
      generatedWith: 'Generato con',
      page: 'Pagina',
    },
  };

  return translations[lang] || translations.es;
};
