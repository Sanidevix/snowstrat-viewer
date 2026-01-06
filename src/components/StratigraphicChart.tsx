import React, { useMemo } from 'react';
import { ParsedSnowProfile, SnowSample, GrainTypeLabel } from '@/types/snowProfile';
import { IACS_COLORS, RESISTANCE_SCALE, TEMPERATURE_SCALE } from '@/constants/iacs';

interface StratigraphicChartProps {
  profile: ParsedSnowProfile;
}

// Calculate cumulative heights for visualization
const calculateCumulativeHeights = (samples: SnowSample[]) => {
  let cumulative = 0;
  return samples.map(sample => {
    cumulative += sample.height;
    return { ...sample, cumulativeHeight: cumulative };
  });
};

const StratigraphicChart: React.FC<StratigraphicChartProps> = ({ profile }) => {
  const { samples, totalHeight } = profile.properties;

  const chartHeight = 400;
  const chartWidth = 500;
  const margin = { top: 40, right: 60, bottom: 40, left: 80 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Use max 200cm or total height, whichever is greater
  const maxHeight = Math.max(200, totalHeight);

  const samplesWithCumulative = useMemo(
    () => calculateCumulativeHeights(samples),
    [samples]
  );

  // Scale functions
  const yScale = (height: number) => {
    return margin.top + (1 - height / maxHeight) * innerHeight;
  };

  const resistanceScale = (resistance: number) => {
    const normalized = resistance / RESISTANCE_SCALE.max;
    return margin.left + normalized * (innerWidth * 0.6);
  };

  const temperatureScale = (temp: number) => {
    const range = TEMPERATURE_SCALE.max - TEMPERATURE_SCALE.min;
    const normalized = (temp - TEMPERATURE_SCALE.min) / range;
    return margin.left + normalized * innerWidth;
  };

  // Temperature line points
  const temperaturePoints = samplesWithCumulative
    .filter(s => s.temperature !== null)
    .map(s => ({
      x: temperatureScale(s.temperature!),
      y: yScale(s.cumulativeHeight),
    }));

  const temperaturePath = temperaturePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Y-axis ticks
  const yTicks = [];
  for (let h = 0; h <= maxHeight; h += 20) {
    yTicks.push(h);
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-chart-bg rounded-lg p-4">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-full max-h-[400px]"
        style={{ fontFamily: 'var(--font-mono)' }}
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
            Altura (cm)
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

        {/* X-axis Bottom (Resistance) */}
        <g transform={`translate(0, ${chartHeight - margin.bottom})`}>
          <line
            x1={margin.left}
            x2={margin.left + innerWidth * 0.6}
            stroke="hsl(var(--chart-axis))"
            strokeWidth={1}
          />
          <text
            x={margin.left + (innerWidth * 0.6) / 2}
            y={30}
            textAnchor="middle"
            fontSize={10}
            fill="hsl(var(--chart-axis))"
            className="font-sans"
          >
            Resistencia (N)
          </text>
          {[0, 30, 60, 90, 120].map(tick => (
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
            Temperatura (°C)
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

        {/* Resistance bars (stacked from bottom) */}
        {samplesWithCumulative.map((sample, index) => {
          const prevHeight = index > 0 ? samplesWithCumulative[index - 1].cumulativeHeight : 0;
          const y1 = yScale(prevHeight);
          const y2 = yScale(sample.cumulativeHeight);
          const barHeight = y1 - y2;
          const barWidth = resistanceScale(sample.resistance) - margin.left;
          const color = IACS_COLORS[sample.grainTypeLabel as GrainTypeLabel] || '#888888';

          return (
            <g key={sample.id}>
              <rect
                x={margin.left}
                y={y2}
                width={Math.max(0, barWidth)}
                height={Math.max(0, barHeight)}
                fill={color}
                stroke="hsl(var(--foreground))"
                strokeWidth={0.5}
                opacity={0.85}
              />
              {/* Grain type label inside bar if tall enough */}
              {barHeight > 15 && (
                <text
                  x={margin.left + 8}
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
      </svg>
    </div>
  );
};

export default StratigraphicChart;
