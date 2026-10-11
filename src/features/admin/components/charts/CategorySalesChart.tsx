"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import { ShoppingBag, Sparkles } from "lucide-react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { CategorySalesDataPoint } from "./types"

const DEFAULT_CATEGORY_DATA: CategorySalesDataPoint[] = [
  { category: "Electronics", sales: 45 },
  { category: "Clothing", sales: 32 },
  { category: "Accessories", sales: 24 },
  { category: "Home", sales: 18 },
]

// Distinct modern color accents for high contrast & immediate visual distinction
const CATEGORY_GRADIENTS = [
  { from: "#3b82f6", to: "#1d4ed8", id: "cat-blue" },
  { from: "#10b981", to: "#047857", id: "cat-emerald" },
  { from: "#8b5cf6", to: "#6d28d9", id: "cat-purple" },
  { from: "#f59e0b", to: "#d97706", id: "cat-amber" },
]

const chartConfig = {
  sales: {
    label: "Units Sold",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export interface CategorySalesChartProps {
  data?: CategorySalesDataPoint[]
  className?: string
}

export function CategorySalesChart({
  data = DEFAULT_CATEGORY_DATA,
  className,
}: CategorySalesChartProps) {
  const totalUnits = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.sales, 0),
    [data]
  )

  const topCategory = React.useMemo(() => {
    return [...data].sort((a, b) => b.sales - a.sales)[0] || { category: "N/A", sales: 0 }
  }, [data])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xs backdrop-blur-sm transition-all hover:border-blue-200 hover:shadow-md ${
        className || ""
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-blue-500/5 blur-3xl" />

      {/* Header Info */}
      <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-500/20">
              <ShoppingBag className="size-4.5" />
            </span>
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Sales by Category
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Merchandise volume distribution across store catalog departments
          </p>
        </div>

        {/* Top Performer Badge */}
        <div className="flex items-baseline gap-3 rounded-xl border border-slate-200/60 bg-white/80 px-4 py-2.5 shadow-2xs">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Top Category
            </span>
            <p className="text-xs font-semibold text-slate-700">
              {topCategory.category}
            </p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Volume
            </span>
            <p className="font-mono text-base font-extrabold text-blue-600">
              {totalUnits} units
            </p>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 12,
            left: 0,
            bottom: 4,
          }}
        >
          <defs>
            {CATEGORY_GRADIENTS.map((grad) => (
              <linearGradient
                key={grad.id}
                id={grad.id}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={grad.from} stopOpacity={1} />
                <stop offset="100%" stopColor={grad.to} stopOpacity={0.8} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="category"
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
            allowDecimals={false}
          />

          <ChartTooltip
            cursor={{ fill: "rgba(241, 245, 249, 0.7)", radius: 6 }}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value) => (
                  <div className="flex items-center justify-between gap-6 font-mono">
                    <span className="text-slate-500">Products Sold:</span>
                    <span className="font-bold text-slate-900">
                      {Number(value).toLocaleString()} units
                    </span>
                  </div>
                )}
              />
            }
          />

          <Bar
            dataKey="sales"
            radius={[8, 8, 0, 0]}
            maxBarSize={46}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length].id})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* Category Pills Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-blue-700">
          <Sparkles className="size-3.5" />
          <span className="font-medium">
            {topCategory.category} represents{" "}
            {totalUnits > 0 ? Math.round((topCategory.sales / totalUnits) * 100) : 0}% of all sales
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {data.map((cat, i) => (
            <span key={cat.category} className="inline-flex items-center gap-1">
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor:
                    CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length].from,
                }}
              />
              {cat.category}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
export default CategorySalesChart
