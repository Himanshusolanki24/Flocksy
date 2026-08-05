"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/constants";
import { cn } from "@/lib/utils";
import { formatINR, formatIndianNumber } from "@/lib/utils";

export interface SeriesPoint {
  label: string;
  value: number;
}

type TooltipPayloadItem = {
  name?: string;
  value?: number;
  payload?: Record<string, unknown>;
};

/** Shared minimal tooltip styled for the design system. */
function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lift">
      {label ? <p className="font-medium text-popover-foreground">{label}</p> : null}
      {payload.map((item, i) => (
        <p key={i} className="flex items-center gap-2 text-muted-foreground">
          {item.color ? (
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
          ) : null}
          <span>
            {item.name}:{" "}
            <strong className="text-foreground">
              {item.prefix ?? ""}
              {item.value != null ? formatIndianNumber(item.value) : "—"}
            </strong>
          </span>
        </p>
      ))}
    </div>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: (TooltipPayloadItem & { color?: string; prefix?: string })[];
  label?: string | number;
  prefix?: string;
}

export interface TrendChartProps {
  data: SeriesPoint[];
  height?: number;
  color?: string;
  prefix?: string;
  showGrid?: boolean;
  className?: string;
}

/** Smooth, gradient area chart — the workhorse for trends. */
export function AreaTrend({
  data,
  height = 220,
  color,
  showGrid = false,
  prefix,
  className,
}: TrendChartProps) {
  const id = useId().replace(/:/g, "");
  const stroke = color ?? "var(--chart-1)";
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />}
          <defs>
            <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} width={50} />
          <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2.5}
            fill={`url(#fill-${id})`}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Simple bars chart. */
export function BarSeries({
  data,
  height = 220,
  color,
  prefix,
  className,
}: TrendChartProps) {
  const stroke = color ?? "var(--chart-1)";
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} width={50} />
          <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ fill: "var(--muted)" }} />
          <Bar dataKey="value" fill={stroke} radius={[8, 8, 0, 0]} maxBarSize={42} animationDuration={900} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Fine-grained line chart. */
export function LineSeries({
  data,
  height = 220,
  color,
  prefix,
  className,
}: TrendChartProps) {
  const stroke = color ?? "var(--chart-1)";
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} width={50} />
          <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ stroke: "var(--border)" }} />
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface DonutDatum {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  height?: number;
  centerLabel?: string;
  centerCaption?: string;
  className?: string;
}

/** Donut chart with a centered summary label. */
export function DonutChart({ data, height = 220, centerLabel, centerCaption, className }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="72%"
            outerRadius="100%"
            paddingAngle={3}
            stroke="none"
            animationDuration={900}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerLabel ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight">{centerLabel}</span>
          {centerCaption ? <span className="text-xs text-muted-foreground">{centerCaption}</span> : null}
        </div>
      ) : null}
      {total === 0 ? null : null}
    </div>
  );
}

export interface SparklineProps {
  values: number[];
  height?: number;
  color?: string;
  className?: string;
  prefix?: string;
}

/** Minimal sparkline for compact KPI cards. */
export function Sparkline({ values, height = 40, color, className }: SparklineProps) {
  const data = values.map((value, i) => ({ label: i, value }));
  const stroke = color ?? "var(--chart-1)";
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} fill={stroke} fillOpacity={0.12} animationDuration={600} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { formatINR };