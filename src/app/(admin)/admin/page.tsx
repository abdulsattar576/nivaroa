import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";

const metrics = [
  {
    label: "Total revenue",
    value: "$24,680.50",
    change: "+12.8%",
    note: "vs. previous 7 days",
    icon: CircleDollarSign,
    iconClass: "bg-[#e8f2e9] text-[#34734f]",
  },
  {
    label: "Orders",
    value: "384",
    change: "+8.2%",
    note: "vs. previous 7 days",
    icon: ShoppingBag,
    iconClass: "bg-[#eef0fb] text-[#6268a8]",
  },
  {
    label: "Average order",
    value: "$64.27",
    change: "+4.6%",
    note: "vs. previous 7 days",
    icon: UsersRound,
    iconClass: "bg-[#fbf0df] text-[#a77427]",
  },
  {
    label: "Active products",
    value: "128",
    change: "+6.1%",
    note: "vs. previous 7 days",
    icon: Package,
    iconClass: "bg-[#f7eaf0] text-[#a35476]",
  },
];

const orders = [
  { id: "NV-2084", customer: "Mara Ellison", initials: "ME", date: "Today, 10:42 AM", amount: "$184.00", status: "Processing" },
  { id: "NV-2083", customer: "Jordan Lee", initials: "JL", date: "Today, 9:18 AM", amount: "$96.50", status: "Paid" },
  { id: "NV-2082", customer: "Sofia Bennett", initials: "SB", date: "Yesterday", amount: "$248.00", status: "Shipped" },
  { id: "NV-2081", customer: "Theo Martin", initials: "TM", date: "Yesterday", amount: "$72.00", status: "Paid" },
];

const products = [
  { name: "Everyday ceramic mug", category: "Home & living", sold: 86, revenue: "$2,408", percent: "88%", color: "bg-[#477b59]" },
  { name: "Linen market tote", category: "Accessories", sold: 64, revenue: "$1,920", percent: "68%", color: "bg-[#8b9b69]" },
  { name: "Botanical candle set", category: "Home & living", sold: 51, revenue: "$1,785", percent: "54%", color: "bg-[#c39a5b]" },
];

const statusStyles: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-600/15",
};

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f8f5] px-4 pb-10 pt-3 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.19em] text-[#64806d]">
                Store overview
              </p>
              <span className="rounded-full border border-[#dce8dc] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#66806b]">
                Sample data
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#192b21] sm:text-[2.15rem]">
              Good morning, admin
            </h1>
            <p className="mt-1.5 text-sm text-[#748078]">
              Here’s what’s happening with your store this week.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2.5 rounded-xl border border-[#e3e8e1] bg-white px-3.5 py-2.5 text-sm font-medium text-[#48594e] shadow-sm shadow-[#203525]/[0.03]">
            <CalendarDays className="size-4 text-[#66806b]" aria-hidden="true" />
            <span>Last 7 days</span>
            <span className="hidden text-[#a1aaa3] sm:inline">·</span>
            <span className="hidden text-[#7d8980] sm:inline">Oct 1 – Oct 7</span>
          </div>
        </header>

        <section aria-label="Store metrics" className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article key={metric.label} className="rounded-2xl border border-[#e8ebe5] bg-white p-5 shadow-[0_5px_18px_-15px_rgba(27,48,34,0.28)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#6e7a71]">{metric.label}</p>
                    <p className="mt-3 text-[1.8rem] font-semibold leading-none tracking-tight text-[#1d3025]">{metric.value}</p>
                  </div>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${metric.iconClass}`}>
                    <Icon className="size-[19px]" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs">
                  <span className="inline-flex items-center gap-0.5 font-semibold text-[#398056]">
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    {metric.change}
                  </span>
                  <span className="text-[#9aa39c]">{metric.note}</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.85fr)]">
          <article className="overflow-hidden rounded-2xl border border-[#e8ebe5] bg-white shadow-[0_5px_18px_-15px_rgba(27,48,34,0.28)]">
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
              <div>
                <h2 className="text-base font-semibold text-[#203329]">Revenue over time</h2>
                <p className="mt-1 text-xs text-[#8a958d]">A closer look at your store’s performance</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#557661]">
                <span className="size-2 rounded-full bg-[#4b805c]" aria-hidden="true" />
                Revenue
              </div>
            </div>
            <div className="mt-3 px-3 sm:px-5">
              <svg className="h-[230px] w-full overflow-visible" viewBox="0 0 720 250" role="img" aria-labelledby="revenue-chart-title revenue-chart-description" preserveAspectRatio="none">
                <title id="revenue-chart-title">Revenue from October 1 through October 7</title>
                <desc id="revenue-chart-description">Sample revenue rises overall through the week, with a peak on October 7.</desc>
                <defs>
                  <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6c9d72" stopOpacity="0.19" />
                    <stop offset="100%" stopColor="#6c9d72" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[42, 91, 140, 189].map((y) => (
                  <line key={y} x1="42" y1={y} x2="708" y2={y} stroke="#edf0eb" strokeDasharray="3 5" />
                ))}
                <text x="0" y="46" fill="#98a199" fontSize="10">$5k</text>
                <text x="0" y="95" fill="#98a199" fontSize="10">$3.5k</text>
                <text x="0" y="144" fill="#98a199" fontSize="10">$2k</text>
                <text x="0" y="193" fill="#98a199" fontSize="10">$500</text>
                <path d="M42 171 C78 159 89 141 137 146 S196 160 232 124 S290 130 327 116 S384 133 422 94 S483 102 517 76 S581 95 612 62 S672 60 708 35 L708 205 L42 205 Z" fill="url(#revenue-fill)" />
                <path d="M42 171 C78 159 89 141 137 146 S196 160 232 124 S290 130 327 116 S384 133 422 94 S483 102 517 76 S581 95 612 62 S672 60 708 35" fill="none" stroke="#4b805c" strokeLinecap="round" strokeWidth="3" />
                <circle cx="708" cy="35" r="5" fill="#fff" stroke="#4b805c" strokeWidth="3" />
                {[
                  [42, "Oct 1"], [153, "Oct 2"], [264, "Oct 3"], [375, "Oct 4"],
                  [486, "Oct 5"], [597, "Oct 6"], [708, "Oct 7"],
                ].map(([x, label]) => (
                  <text key={label} x={x} y="232" fill="#98a199" fontSize="10" textAnchor={x === 42 ? "start" : x === 708 ? "end" : "middle"}>{label}</text>
                ))}
              </svg>
            </div>
            <div className="mx-5 mb-5 mt-1 flex items-center gap-2 rounded-xl bg-[#f5f8f3] px-3.5 py-3 text-xs text-[#69776d] sm:mx-6 sm:mb-6">
              <Sparkles className="size-4 shrink-0 text-[#668c62]" aria-hidden="true" />
              <span>Your strongest sales day was <strong className="font-semibold text-[#385b42]">Tuesday</strong>, up 18% from your daily average.</span>
            </div>
          </article>

          <article id="top-products" className="rounded-2xl border border-[#e8ebe5] bg-white p-5 shadow-[0_5px_18px_-15px_rgba(27,48,34,0.28)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#203329]">Top products</h2>
                <p className="mt-1 text-xs text-[#8a958d]">Best sellers this week</p>
              </div>
              <span className="grid size-9 place-items-center rounded-xl bg-[#f1f5ef] text-[#557661]">
                <Package className="size-[17px]" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-5 space-y-5">
              {products.map((product, index) => (
                <div key={product.name}>
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f2f4ef] text-xs font-semibold text-[#6c7c6e]">0{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#304136]">{product.name}</p>
                          <p className="mt-0.5 text-xs text-[#9aa39c]">{product.category} · {product.sold} sold</p>
                        </div>
                        <span className="whitespace-nowrap text-sm font-semibold text-[#304136]">{product.revenue}</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]">
                        <div className={`h-full rounded-full ${product.color}`} style={{ width: product.percent }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/product" className="mt-6 flex items-center justify-between border-t border-[#eef0ec] pt-4 text-xs font-semibold text-[#557661] transition hover:text-[#28543a]">
              Browse products
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        </section>

        <section id="orders" className="mt-5 overflow-hidden rounded-2xl border border-[#e8ebe5] bg-white shadow-[0_5px_18px_-15px_rgba(27,48,34,0.28)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef0ec] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-[#203329]">Recent orders</h2>
              <p className="mt-1 text-xs text-[#8a958d]">A snapshot of your latest customer orders</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-[#557661] transition hover:text-[#28543a]">
              View all orders
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#fafbf9] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#929c94]">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Order</th>
                  <th scope="col" className="px-4 py-3.5">Customer</th>
                  <th scope="col" className="px-4 py-3.5">Date</th>
                  <th scope="col" className="px-4 py-3.5">Amount</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5"><span className="sr-only">Open order</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2ee]">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-[#fbfcfa]">
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#4b7657]">{order.id}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-full bg-[#eef3ec] text-[10px] font-semibold text-[#5d765e]">{order.initials}</span>
                        <span className="font-medium text-[#3d4b41]">{order.customer}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[#89938b]">{order.date}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-[#3d4b41]">{order.amount}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${statusStyles[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#a0a9a1]">
                      <ArrowDownRight className="ml-auto size-4 -rotate-45" aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 border-t border-[#eef0ec] px-5 py-3.5 text-[11px] text-[#9aa39c] sm:px-6">
            <span className="size-1.5 rounded-full bg-[#89a576]" aria-hidden="true" />
            Preview figures are sample data and are not connected to live store records.
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;