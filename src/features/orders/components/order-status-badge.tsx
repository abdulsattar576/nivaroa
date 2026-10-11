import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  RotateCcw,
  Truck,
} from "lucide-react";
import type { OrderStatus } from "../schemas/order.schema";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/20">
          <Clock className="size-3 text-amber-600" />
          <span>Pending Confirmation</span>
        </span>
      );

    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-600/20">
          <CheckCircle2 className="size-3 text-sky-600" />
          <span>Order Confirmed</span>
        </span>
      );

    case "processing":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-600/20">
          <Package className="size-3 text-indigo-600" />
          <span>Packaging & Processing</span>
        </span>
      );

    case "shipped":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-600/20">
          <Truck className="size-3 text-purple-600" />
          <span>Dispatched / In Transit</span>
        </span>
      );

    case "delivered":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
          <CheckCircle2 className="size-3 text-emerald-600" />
          <span>Delivered</span>
        </span>
      );

    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 ring-1 ring-rose-600/20">
          <AlertCircle className="size-3 text-rose-600" />
          <span>Cancelled</span>
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {status}
        </span>
      );
  }
}

