"use client"

import * as React from "react"
import { PieChart, Pie, Cell } from "recharts"
import { CreditCard, Wallet, Banknote } from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { PaymentMethodDataPoint } from "./types"

const DEFAULT_PAYMENT_DATA: PaymentMethodDataPoint[] = [
  { method: "Easypaisa", count: 25 },
  { method: "JazzCash", count: 18 },
  { method: "Cash on Delivery", count: 15 },
]

interface MethodStyle {
  color: string
  gradient: [string, string]
  icon: React.ComponentType<{ className?: string }>
}

const METHOD_METRICS: Record<string, MethodStyle> = {
  Easypaisa: {
    color: "#059669",
    gradient: ["#34d399", "#059669"],
    icon: Wallet,
  },
  JazzCash: {
    color: "#e11d48",
    gradient: ["#fb7185", "#e11d48"],
    icon: CreditCard,
  },
  "Cash on Delivery": {
    color: "#0f172a",
    gradient: ["#334155", "#0f172a"],
    icon: Banknote,
  },
}

const chartConfig = {
  Easypaisa: { label: "Easypaisa", color: "#059669" },
  JazzCash: { label: "JazzCash", color: "#e11d48" },
  "Cash on Delivery": { label: "Cash on Delivery", color: "#0f172a" },
} satisfies ChartConfig

export interface PaymentMethodChartProps {
  data?: PaymentMethodDataPoint[]
  className?: string
}

export function PaymentMethodChart({
  data = DEFAULT_PAYMENT_DATA,
  className,
}: PaymentMethodChartProps) {
  const totalTransactions = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  )

  const topMethod = React.useMemo(() => {
    return (
      [...data].sort((a, b) => b.count - a.count)[0] || {
        method: "N/A",
        count: 0,
      }
    )
  }, [data])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xs backdrop-blur-sm transition-all hover:border-slate-300 hover:shadow-md ${
        className || ""
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-slate-500/5 blur-3xl" />

      {/* Header Info */}
      <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-800 ring-1 ring-slate-300/40">
              <CreditCard className="size-4.5" />
            </span>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Payment Methods
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Share of transactions processed across digital and cash channels
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-white/80 px-3.5 py-2 text-right shadow-2xs">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Preferred Method
          </span>
          <p className="text-xs font-bold text-slate-800">
            {topMethod.method}
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
              {Object.entries(METHOD_METRICS).map(([method, item]) => (
                <linearGradient
                  key={method}
                  id={`method-grad-${method.replace(/\s+/g, "-")}`}
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
                  nameKey="method"
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex items-center justify-between gap-6 font-mono">
                      <span className="text-slate-500">{name}:</span>
                      <span className="font-bold text-slate-900">
                        {value} orders (
                        {totalTransactions > 0
                          ? `${Math.round((Number(value) / totalTransactions) * 100)}%`
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
              nameKey="method"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.method}
                  fill={`url(#method-grad-${entry.method.replace(/\s+/g, "-")})`}
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
            {totalTransactions}
          </span>
          <span className="text-[10px] text-slate-400">Transactions</span>
        </div>
      </div>

      {/* Modern Badge Grid Legend */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {data.map((item) => {
          const config = METHOD_METRICS[item.method] || {
            color: "#64748b",
            gradient: ["#94a3b8", "#64748b"],
            icon: CreditCard,
          }
          const Icon = config.icon
          const pct =
            totalTransactions > 0
              ? Math.round((item.count / totalTransactions) * 100)
              : 0

          return (
            <div
              key={item.method}
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
                    {item.method}
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
export default PaymentMethodChart
