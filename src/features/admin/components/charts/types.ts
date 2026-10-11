export interface RevenueDataPoint {
  date: string
  revenue: number
}

export interface CategorySalesDataPoint {
  category: string
  sales: number
}

export interface OrderStatusDataPoint {
  status: "Paid" | "Pending" | "Processing" | "Cancelled" | string
  count: number
}

export interface PaymentMethodDataPoint {
  method: "Easypaisa" | "JazzCash" | "Cash on Delivery" | string
  count: number
}

