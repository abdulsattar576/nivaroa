import * as React from "react"
import RevenueChart from "./RevenueChart"
import CategorySalesChart from "./CategorySalesChart"
import OrderStatusChart from "./OrderStatusChart"
import PaymentMethodChart from "./PaymentMethodChart"
import type {
  RevenueDataPoint,
  CategorySalesDataPoint,
  OrderStatusDataPoint,
  PaymentMethodDataPoint,
} from "./types"

export interface AdminChartsSectionProps {
  revenueData?: RevenueDataPoint[]
  categorySalesData?: CategorySalesDataPoint[]
  orderStatusData?: OrderStatusDataPoint[]
  paymentMethodData?: PaymentMethodDataPoint[]
  className?: string
}

/**
 * AdminChartsSection renders the complete responsive chart dashboard section
 * containing all 4 chart widgets (Revenue, Sales by Category, Order Status, and Payment Methods).
 * Can be imported into any dashboard page as a single clean section.
 */
export function AdminChartsSection({
  revenueData,
  categorySalesData,
  orderStatusData,
  paymentMethodData,
  className,
}: AdminChartsSectionProps) {
  return (
    <section className={`space-y-6 ${className || ""}`}>
      {/* Upper Grid: 2 Column Wide Charts (Revenue & Category Sales) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <CategorySalesChart data={categorySalesData} />
      </div>

      {/* Lower Grid: 2 Column Donut Charts (Order Status & Payment Methods) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <OrderStatusChart data={orderStatusData} />
        <PaymentMethodChart data={paymentMethodData} />
      </div>
    </section>
  )
}

export {
  RevenueChart,
  CategorySalesChart,
  OrderStatusChart,
  PaymentMethodChart,
}
export * from "./types"
export default AdminChartsSection
