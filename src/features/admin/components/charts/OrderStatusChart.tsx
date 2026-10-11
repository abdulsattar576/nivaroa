"use client"

import * as React from "react"
import { PieChart, Pie, Cell } from "recharts"
import { CheckCircle2, Clock, AlertTriangle, XCircle, Layers } from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { OrderStatusDataPoint } from "./types"

const DEFAULT_ORDER_STATUS_DATA: OrderStatusDataPoint[] = [
  { status: "Paid", count: 35 },
  { status: "Pending", count: 12 },
  { status: "Processing", count: 8 },
  { status: "Cancelled", count: 4 },
]

interface StatusStyle {
  color: string
  gradient: [string, string]
  icon: React.ComponentType<{ className?: string }>
}

const STATUS_METRICS: Record<string, StatusStyle> = {
  Paid: {
    color: "#059669",
    gradient: ["#10b981", "#059669"],
    icon: CheckCircle2,
  },
  Pending: {
    color: "#d97706",
    gradient: ["#fbbf24", "#d97706"],
    icon: Clock,
  },
  Processing: {
    color: "#2563eb",
    gradient: ["#60a5fa", "#2563eb"],
    icon: Layers,
  },
  Cancelled: {
    color: "#e11d48",
    gradient: ["#f43f5e", "#be123c"],
    icon: XCircle,
  },
}

const chartConfig = {
  Paid: { label: "Paid", color: "#059669" },
  Pending: { label: "Pending", color: "#d97706" },
  Processing: { label: "Processing", color: "#2563eb" },
  Cancelled: { label: "Cancelled", color: "#e11d48" },
} satisfies ChartConfig

export interface OrderStatusChartProps {
  data?: OrderStatusDataPoint[]
  className?: string
}

export function OrderStatusChart({
  data = DEFAULT_ORDER_STATUS_DATA,
  className,
}: OrderStatusChartProps) {
  const totalOrders = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  )

  const paidOrders = React.useMemo(
    () => data.find((d) => d.status === "Paid")?.count || 0,
    [data]
  )

  const completionRate = React.useMemo(
    () => (totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0),
    [totalOrders, paidOrders]
  )

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xs backdrop-blur-sm transition-all hover:border-emerald-200 hover:shadow-md ${
        className || ""
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header Info */}
      <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="size-4.5" />
            </span>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Order Status
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Real-time fulfillment and operational status distribution
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white/80 px-3.5 py-2 text-right shadow-2xs">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Paid Rate
          </span>
          <p className="font-mono text-base font-extrabold text-emerald-600">
            {completionRate}%
          </p>
        </div>
      </div>

      {/* Chart Canvas & Center Metric */}
      <div className="relative mx-auto flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[220px] w-full aspect-auto"
        >
          <PieChart>
            <defs>
              {Object.entries(STATUS_METRICS).map(([status, item]) => (
                <linearGradient
                  key={status}
                  id={`status-grad-${status}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor={item.gradient[0]} />
                  <stop offset="100%" stopColor={item.gradient[1]} />
                </linearGradient>
              ))}
            </defs>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="status"
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-6 font-mono">
                      <span className="text-slate-500">{name}:</span>
                      <span className="font-bold text-slate-900">
                        {value} orders (
                        {totalOrders > 0
                          ? `${Math.round((Number(value) / totalOrders) * 100)}%`
                          : "0%"}
                        )
                      </span>
                    </div>
                  )}
                />
              }
            />

            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={`url(#status-grad-${entry.status})`}
                  className="transition-opacity hover:opacity-85"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Center Donut Hole Typography Stat */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total
          </span>
          <span className="font-mono text-2xl font-black text-slate-900">
            {totalOrders}
          </span>
          <span className="text-[10px] text-slate-400">Orders</span>
        </div>
      </div>

      {/* Modern Badge Grid Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {data.map((item) => {
          const config = STATUS_METRICS[item.status] || {
            color: "#64748b",
            gradient: ["#94a3b8", "#64748b"],
            icon: AlertTriangle,
          }
          const Icon = config.icon
          const pct =
            totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0

          return (
            <div
              key={item.status}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/90 p-2.5 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="grid size-6 place-items-center rounded-lg text-white"
                  style={{
                    background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`,
                  }}
                >
                  <Icon className="size-3.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {item.status}
                  </p>
                  <p className="text-[10px] text-slate-400">{pct}% share</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-900">
                {item.count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default OrderStatusChart
