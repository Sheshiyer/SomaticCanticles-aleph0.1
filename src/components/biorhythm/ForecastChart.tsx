"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { cn } from "../../lib/utils";
import {
  type PredictionData,
  CYCLE_CONFIGS,
  isPeak,
} from "../../lib/biorhythm";

export interface ForecastChartProps {
  /** Prediction data to display */
  data: PredictionData;
  /** Number of days to show (defaults to all) */
  days?: number;
  /** Whether to show animated transitions */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show compact layout (mini chart) */
  compact?: boolean;
  /** Height of the chart */
  height?: number;
}

interface ChartDataPoint {
  date: string;
  dateLabel: string;
  physical: number;
  emotional: number;
  intellectual: number;
  spiritual: number;
  isPeak: {
    physical: boolean;
    emotional: boolean;
    intellectual: boolean;
    spiritual: boolean;
  };
}

/**
 * ForecastChart - Line chart showing 30-day biorhythm trend
 * 
 * Features:
 * - 4 lines (one per cycle)
 * - X-axis: dates
 * - Y-axis: cycle value (-1 to 1)
 * - Peak markers
 * - Interactive tooltip on hover
 */
export function ForecastChart({
  data,
  days,
  animated = true,
  className,
  compact = false,
  height = compact ? 200 : 300,
}: ForecastChartProps) {
  // Prepare chart data
  const chartData: ChartDataPoint[] = useMemo(() => {
    const sliceEnd = days ? Math.min(days, data.predictions.length) : data.predictions.length;
    
    return data.predictions.slice(0, sliceEnd).map((day) => {
      const date = new Date(day.date);
      
      return {
        date: day.date,
        dateLabel: compact
          ? date.toLocaleDateString("en-US", { weekday: "narrow" })
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        physical: day.physical,
        emotional: day.emotional,
        intellectual: day.intellectual,
        spiritual: day.spiritual,
        isPeak: {
          physical: isPeak(day.physical),
          emotional: isPeak(day.emotional),
          intellectual: isPeak(day.intellectual),
          spiritual: isPeak(day.spiritual),
        },
      };
    });
  }, [data.predictions, days, compact]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;

    const date = new Date(label || "");
    
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="space-y-1">
          {payload.map((entry) => {
            const cycleName = entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1);
            const percentage = Math.round(entry.value * 100);
            
            return (
              <div key={entry.dataKey} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{cycleName}:</span>
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    percentage > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {percentage > 0 ? "+" : ""}{percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Calculate peak markers for each cycle
  const peakMarkers = useMemo(() => {
    const markers: Array<{ date: string; cycle: string; value: number; color: string }> = [];
    
    chartData.forEach((day) => {
      CYCLE_CONFIGS.forEach((config) => {
        if (day.isPeak[config.key]) {
          markers.push({
            date: day.date,
            cycle: config.key,
            value: day[config.key],
            color: config.colorValue,
          });
        }
      });
    });
    
    return markers;
  }, [chartData]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={cn("w-full", className)}
      variants={containerVariants}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
    >
      {/* Chart container */}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: compact ? 10 : 30,
            left: compact ? -20 : 0,
            bottom: compact ? 0 : 10,
          }}
        >
          {/* Zero reference line */}
          <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.2} strokeDasharray="3 3" />
          
          {/* High/low reference lines */}
          <ReferenceLine y={0.8} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="3 3" />
          <ReferenceLine y={-0.8} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="3 3" />

          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            strokeOpacity={0.05}
            vertical={!compact}
          />

          {/* X Axis */}
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: compact ? 10 : 11, fill: "currentColor" }}
            tickLine={false}
            axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
            interval={compact ? 0 : Math.floor(chartData.length / 6)}
          />

          {/* Y Axis */}
          <YAxis
            domain={[-1, 1]}
            tick={{ fontSize: compact ? 9 : 10, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Math.round(value * 100)}%`}
            width={compact ? 30 : 45}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Cycle lines */}
          {CYCLE_CONFIGS.map((config) => (
            <Line
              key={config.key}
              type="monotone"
              dataKey={config.key}
              stroke={config.colorValue}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: config.colorValue,
                strokeWidth: 2,
                stroke: "white",
              }}
              animationDuration={animated ? 1500 : 0}
              animationBegin={0}
            />
          ))}

          {/* Peak markers (only in non-compact mode) */}
          {!compact &&
            peakMarkers.slice(0, 10).map((marker, index) => (
              <ReferenceDot
                key={`${marker.date}-${marker.cycle}-${index}`}
                x={chartData.find((d) => d.date === marker.date)?.dateLabel}
                y={marker.value}
                r={4}
                fill={marker.color}
                stroke="white"
                strokeWidth={2}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend (only in non-compact mode) */}
      {!compact && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {CYCLE_CONFIGS.map((config) => (
            <div key={config.key} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: config.colorValue }}
              />
              <span className="text-xs text-muted-foreground">{config.name}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ForecastChart;
