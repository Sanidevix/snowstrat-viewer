import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ParsedSnowProfile, SnowSample, GrainTypeLabel } from '@/types/snowProfile';
import { IACS_COLORS, RESISTANCE_SCALE, TEMPERATURE_SCALE } from '@/constants/iacs';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StratigraphicChartProps {
  profile: ParsedSnowProfile;
}

// Calculate cumulative heights and midpoints for visualization
const calculateLayerData = (samples: SnowSample[]) => {
  let cumulative = 0;
  return samples.map(sample => {
    const prevCumulative = cumulative;
    cumulative += sample.height;
    // Midpoint of this layer for temperature point placement
    const midpoint = prevCumulative + sample.height / 2;
    return { 
      ...sample, 
      cumulativeHeight: cumulative,
      prevCumulativeHeight: prevCumulative,
      midpoint 
    };
  });
};

const StratigraphicChart: React.FC<StratigraphicChartProps> = ({ profile }) => {
  const { t } = useTranslation();
  const { samples, totalHeight, ctSamples } = profile.properties;
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom state
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const chartHeight = 400;
  const chartWidth = 600; // Increased width to accommodate CT results
  const margin = { top: 40, right: 160, bottom: 40, left: 60 }; // Increased right margin for CT labels
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Use max 200cm or total height, whichever is greater
  const maxHeight = Math.max(200, totalHeight);

  const layerData = useMemo(
    () => calculateLayerData(samples),
    [samples]
  );

  // Scale functions
  const yScale = (height: number) => {
    return margin.top + (1 - height / maxHeight) * innerHeight;
  };

  // Resistance scale: 120 on left, 0 on right
  const resistanceScale = (resistance: number) => {
    // 120 maps to left edge, 0 maps to right edge
    const normalized = 1 - (resistance / RESISTANCE_SCALE.max);
    return margin.left + normalized * innerWidth;
  };

  // Temperature scale: -24 to 0
  const temperatureScale = (temp: number) => {
    const range = TEMPERATURE_SCALE.max - TEMPERATURE_SCALE.min;
    const normalized = (temp - TEMPERATURE_SCALE.min) / range;
    return margin.left + normalized * innerWidth;
  };

  // Temperature line points - positioned at midpoint of each layer
  const temperaturePoints = layerData
    .filter(s => s.temperature !== null)
    .map(s => ({
      x: temperatureScale(s.temperature!),
      y: yScale(s.midpoint),
      temp: s.temperature,
    }));

  const temperaturePath = temperaturePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Y-axis ticks
  const yTicks = [];
  for (let h = 0; h <= maxHeight; h += 20) {
    yTicks.push(h);
  }

  // Resistance axis ticks (120 to 0)
  const resistanceTicks = [120, 90, 60, 30, 0];

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.3, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.3, 1));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 1), 4));
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [scale, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Calculate transform
  const transform = `scale(${scale}) translate(${panOffset.x / scale}px, ${panOffset.y / scale}px)`;

  return (
    <div className="w-full h-full flex flex-col bg-chart-bg rounded-lg overflow-hidden">
      {/* Zoom controls */}
      <div className="flex items-center justify-end gap-1 p-2 border-b border-border bg-muted/30">
        <span className="text-xs text-muted-foreground mr-2">
          {t('chart.zoom')}: {Math.round(scale * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleZoomOut}
          disabled={scale <= 1}
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleZoomIn}
          disabled={scale >= 4}
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={handleReset}
          disabled={scale === 1 && panOffset.x === 0 && panOffset.y === 0}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Chart container with zoom/pan */}
      <div 
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full max-h-[350px]"
          style={{ 
            fontFamily: 'var(--font-mono)',
            transform,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {/* Grid lines */}
          {yTicks.map(tick => (
            <line
              key={`grid-${tick}`}
              x1={margin.left}
              x2={chartWidth - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="hsl(var(--chart-grid))"
              strokeWidth={0.5}
              strokeDasharray="4,4"
            />
          ))}

          {/* Y-axis (Height) - Right side */}
          <g transform={`translate(${chartWidth - margin.right + 10}, 0)`}>
            <text
              x={25}
              y={margin.top - 20}
              textAnchor="middle"
              fontSize={10}
              fill="hsl(var(--chart-axis))"
              className="font-sans"
            >
              {t('chart.height')}
            </text>
            {yTicks.map(tick => (
              <g key={`y-${tick}`} transform={`translate(0, ${yScale(tick)})`}>
                <line x1={-5} x2={0} stroke="hsl(var(--chart-axis))" strokeWidth={1} />
                <text
                  x={15}
                  y={4}
                  fontSize={9}
                  fill="hsl(var(--chart-axis))"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            ))}
          </g>

          {/* X-axis Bottom (Resistance) - 120 to 0, full width */}
          <g transform={`translate(0, ${chartHeight - margin.bottom})`}>
            <line
              x1={margin.left}
              x2={chartWidth - margin.right}
              stroke="hsl(var(--chart-axis))"
              strokeWidth={1}
            />
            <text
              x={margin.left + innerWidth / 2}
              y={30}
              textAnchor="middle"
              fontSize={10}
              fill="hsl(var(--chart-axis))"
              className="font-sans"
            >
              {t('chart.resistance')}
            </text>
            {resistanceTicks.map(tick => (
              <g key={`r-${tick}`} transform={`translate(${resistanceScale(tick)}, 0)`}>
                <line y1={0} y2={5} stroke="hsl(var(--chart-axis))" strokeWidth={1} />
                <text
                  y={18}
                  fontSize={9}
                  fill="hsl(var(--chart-axis))"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            ))}
          </g>

          {/* X-axis Top (Temperature) */}
          <g transform={`translate(0, ${margin.top})`}>
            <line
              x1={margin.left}
              x2={chartWidth - margin.right}
              stroke="hsl(var(--chart-temp-line))"
              strokeWidth={1}
            />
            <text
              x={margin.left + innerWidth / 2}
              y={-20}
              textAnchor="middle"
              fontSize={10}
              fill="hsl(var(--chart-temp-line))"
              className="font-sans"
            >
              {t('chart.temperature')}
            </text>
            {TEMPERATURE_SCALE.ticks.map(tick => (
              <g key={`t-${tick}`} transform={`translate(${temperatureScale(tick)}, 0)`}>
                <line y1={-5} y2={0} stroke="hsl(var(--chart-temp-line))" strokeWidth={1} />
                <text
                  y={-10}
                  fontSize={9}
                  fill="hsl(var(--chart-temp-line))"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            ))}
          </g>

          {/* Resistance bars - extending from resistance position to right edge (0) */}
          {layerData.map((sample) => {
            const y1 = yScale(sample.prevCumulativeHeight);
            const y2 = yScale(sample.cumulativeHeight);
            const barHeight = y1 - y2;
            
            // Bar starts at resistance position and extends to the right edge (0)
            const barStartX = resistanceScale(sample.resistance);
            const barEndX = chartWidth - margin.right;
            const barWidth = barEndX - barStartX;
            
            const color = IACS_COLORS[sample.grainTypeLabel as GrainTypeLabel] || '#888888';

            return (
              <g key={sample.id}>
                <rect
                  x={barStartX}
                  y={y2}
                  width={Math.max(0, barWidth)}
                  height={Math.max(0, barHeight)}
                  fill={color}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={0.5}
                  opacity={0.85}
                />
                {/* Grain type label inside bar if tall enough and wide enough */}
                {barHeight > 15 && barWidth > 25 && (
                  <text
                    x={barStartX + 8}
                    y={y2 + barHeight / 2 + 4}
                    fontSize={10}
                    fill="hsl(var(--foreground))"
                    fontWeight={500}
                  >
                    {sample.grainTypeLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Temperature line */}
          {temperaturePath && (
            <>
              <path
                d={temperaturePath}
                fill="none"
                stroke="hsl(var(--chart-temp-line))"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Temperature points */}
              {temperaturePoints.map((point, i) => (
                <circle
                  key={`temp-point-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="hsl(var(--chart-temp-line))"
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </>
          )}

          {/* Left axis line */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={chartHeight - margin.bottom}
            stroke="hsl(var(--chart-axis))"
            strokeWidth={1}
          />

          {/* CT Test Results - displayed to the right of the height axis */}
          {ctSamples && ctSamples.length > 0 && ctSamples.map((ct, index) => {
            // CT depth is from the surface, so we calculate height from bottom
            const heightFromBottom = totalHeight - ct.depth;
            const yPos = yScale(heightFromBottom);
            
            return (
              <g key={`ct-${ct.id || index}`}>
                {/* Marker line connecting to the chart */}
                <line
                  x1={chartWidth - margin.right + 5}
                  y1={yPos}
                  x2={chartWidth - margin.right + 15}
                  y2={yPos}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1.5}
                />
                {/* CT result marker */}
                <circle
                  cx={chartWidth - margin.right + 5}
                  cy={yPos}
                  r={3}
                  fill="hsl(var(--destructive))"
                />
                {/* CT result text */}
                <text
                  x={chartWidth - margin.right + 20}
                  y={yPos + 4}
                  fontSize={8}
                  fill="hsl(var(--destructive))"
                  fontWeight={500}
                  className="font-mono"
                >
                  {ct.formattedResult}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default StratigraphicChart;
