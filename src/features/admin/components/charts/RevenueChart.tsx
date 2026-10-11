"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { RevenueDataPoint } from "./types"

const DEFAULT_REVENUE_DATA: RevenueDataPoint[] = [
  { date: "Oct 1", revenue: 12000 },
  { date: "Oct 2", revenue: 18000 },
  { date: "Oct 3", revenue: 14500 },
  { date: "Oct 4", revenue: 25000 },
  { date: "Oct 5", revenue: 32000 },
]

const chartConfig = {
  revenue: {
    label: "Gross Revenue",
    color: "#059669", // Vibrant Emerald
  },
} satisfies ChartConfig

export interface RevenueChartProps {
  data?: RevenueDataPoint[]
  className?: string
}

export function RevenueChart({
  data = DEFAULT_REVENUE_DATA,
  className,
}: RevenueChartProps) {
  const totalRevenue = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.revenue, 0),
    [data]
  )

  const peakRevenue = React.useMemo(
    () => Math.max(...data.map((d) => d.revenue)),
    [data]
  )

  const growthRate = React.useMemo(() => {
    if (data.length < 2) return 0
    const first = data[0].revenue
    const last = data[data.length - 1].revenue
    return first > 0 ? Math.round(((last - first) / first) * 100) : 0
  }, [data])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xs backdrop-blur-sm transition-all hover:border-emerald-200 hover:shadow-md ${
        className || ""
      }`}
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header Info */}
      <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20">
              <DollarSign className="size-4.5" />
            </span>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Revenue Overview
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Real-time visual trajectory of cumulative sales revenue
          </p>
        </div>

        {/* Highlight Stats Pill */}
        <div className="flex items-baseline gap-3 rounded-xl border border-slate-200/60 bg-white/80 px-4 py-2.5 shadow-2xs">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Current Peak
            </span>
            <p className="font-mono text-xs font-semibold text-slate-700">
              PKR {peakRevenue.toLocaleString()}
            </p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Total Recorded
            </span>
            <p className="font-mono text-base font-extrabold text-emerald-600">
              PKR {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Gradient Smooth Area Graph */}
      <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
        <AreaChart
          data={data}
          margin={{
            top: 16,
            right: 12,
            left: 4,
            bottom: 4,
          }}
        >
          <defs>
            <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
              <stop offset="60%" stopColor="#059669" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.0} />
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="6"
                floodColor="#059669"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            stroke="#94a3b8"
            tick={{ fontSize: 11, fontWeight: 500 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            stroke="#94a3b8"
            tick={{ fontSize: 11, fontWeight: 500 }}
            tickFormatter={(val) =>
              val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`
            }
          />

          <ChartTooltip
            cursor={{
              stroke: "#10b981",
              strokeWidth: 1.5,
              strokeDasharray: "4 4",
            }}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value) => (
                  <div className="flex items-center justify-between gap-6 font-mono">
                    <span className="text-slate-500">Revenue:</span>
                    <span className="font-bold text-emerald-600">
                      PKR {Number(value).toLocaleString()}
                    </span>
                  </div>
                )}
              />
            }
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#059669"
            strokeWidth={3}
            fill="url(#revenueGlow)"
            filter="url(#shadow)"
            activeDot={{
              r: 7,
              fill: "#059669",
              stroke: "#ffffff",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ChartContainer>

      {/* Footer Insight Pill */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-emerald-700">
          <TrendingUp className="size-3.5" />
          <span>+{growthRate}% velocity recorded since baseline</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
          Curated Currency: PKR
          <ArrowUpRight className="size-3" />
        </span>
      </div>
    </div>
  )
}
export default RevenueChart
