"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
  Tooltip,
  Stack,
} from "@mui/material";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip as RechartTooltip, CartesianGrid } from "recharts";

// Professional Rounded Icons
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";

import { adminTheme } from "../../theme/mui-admin-theme";
import type { AdminDashboardData } from "../../services/dashboard-service";

interface MuiAdminDashboardProps {
  data: AdminDashboardData;
  adminName: string;
}

export function MuiAdminDashboard({ data, adminName }: MuiAdminDashboardProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const { metrics, recentOrders, productsSummary, statusBreakdown, monthlySales, yearlySales, salesTrend } = data;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusChipProps = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "delivered":
        return {
          label: "Delivered",
          color: "success" as const,
          icon: <TaskAltRoundedIcon fontSize="small" />,
        };
      case "shipped":
        return {
          label: "Shipped",
          color: "info" as const,
          icon: <LocalShippingRoundedIcon fontSize="small" />,
        };
      case "processing":
        return {
          label: "Processing",
          color: "secondary" as const,
          icon: <SyncRoundedIcon fontSize="small" />,
        };
      case "confirmed":
        return {
          label: "Confirmed",
          color: "primary" as const,
          icon: <TaskAltRoundedIcon fontSize="small" />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "error" as const,
          icon: <CancelRoundedIcon fontSize="small" />,
        };
      case "pending":
      default:
        return {
          label: "Pending",
          color: "warning" as const,
          icon: <PendingActionsRoundedIcon fontSize="small" />,
        };
    }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f7f8f5",
          px: { xs: 2, sm: 4, lg: 5 },
          py: 3,
        }}
      >
        <Box sx={{ maxWidth: 1440, mx: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3.5,
              gap: 2,
            }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "primary.main",
                  }}
                >
                  Live Store Administration
                </Typography>
                <Chip
                  label="Live Supabase Data"
                  size="small"
                  sx={{
                    backgroundColor: "#e8f2e9",
                    color: "#286040",
                    fontWeight: 600,
                    fontSize: "0.6875rem",
                    height: 22,
                  }}
                />
              </Stack>
              <Typography variant="h4" sx={{ color: "#192b21" }}>
                Welcome back, {adminName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#647469", mt: 0.5 }}>
                Real-time snapshot of your catalog, orders, and customer activity.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Tooltip title="Refresh live data">
                <IconButton
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e3e8e1",
                    "&:hover": { backgroundColor: "#f0f4ee" },
                  }}
                >
                  <SyncRoundedIcon
                    fontSize="small"
                    sx={{
                      animation: isRefreshing ? "spin 1s linear infinite" : "none",
                      "@keyframes spin": {
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Button
                component={Link}
                href="/admin/add-product"
                variant="contained"
                startIcon={<AddRoundedIcon />}
                sx={{ px: 2.5, py: 1 }}
              >
                Add Product
              </Button>
              <Button
                component={Link}
                href="/shop"
                target="_blank"
                variant="outlined"
                startIcon={<StorefrontRoundedIcon />}
                sx={{
                  px: 2,
                  py: 1,
                  borderColor: "#d0d9cc",
                  color: "#2b4535",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    borderColor: "#174c3a",
                    backgroundColor: "#f9faf8",
                  },
                }}
              >
                View Store
              </Button>
            </Stack>
          </Box>

          {/* Low stock alert banner (if any) */}
          {(metrics.lowStockCount > 0 || metrics.outOfStockCount > 0) && (
            <Alert
              severity="warning"
              icon={<WarningAmberRoundedIcon />}
              sx={{
                mb: 3,
                borderRadius: 3,
                border: "1px solid #fed7aa",
                backgroundColor: "#fffbeb",
              }}
              action={
                <Button
                  component={Link}
                  href="/admin/product"
                  size="small"
                  color="inherit"
                  sx={{ fontWeight: 700 }}
                >
                  Manage Stock
                </Button>
              }
            >
              <strong>Inventory Notice:</strong>{" "}
              {metrics.outOfStockCount > 0 && `${metrics.outOfStockCount} item(s) are out of stock. `}
              {metrics.lowStockCount > 0 && `${metrics.lowStockCount} item(s) are low on stock (< 5 units).`}
            </Alert>
          )}

          {/* Primary Metrics Grid */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            {/* Total Revenue */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Total Revenue
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {formatCurrency(metrics.totalRevenue)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#e8f2e9",
                        color: "#286040",
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                      }}
                    >
                      <AccountBalanceWalletRoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Lifetime store sales
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* This Month's Sales */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        This Month
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: "#174c3a" }}>
                        {formatCurrency(monthlySales)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#e5f4ee",
                        color: "#1c654e",
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                      }}
                    >
                      <CalendarTodayRoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Current calendar month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* This Year's Sales */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        This Year
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {formatCurrency(yearlySales)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#eff3fc",
                        color: "#3557a6",
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                      }}
                    >
                      <DateRangeRoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Current calendar year
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Orders */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Total Orders
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {metrics.totalOrders}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#eef1fa",
                        color: "#475993",
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                      }}
                    >
                      <ShoppingBagRoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    {metrics.pendingOrdersCount} pending fulfillment
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Average Order Value */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Average Order
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {formatCurrency(metrics.averageOrderValue)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#fbf2e3",
                        color: "#976722",
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                      }}
                    >
                      <QueryStatsRoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Calculated from live orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Catalog & Inventory */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Catalog Inventory
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {metrics.totalProducts}{" "}
                        <Typography component="span" variant="body2" sx={{ color: "#647469" }}>
                          products
                        </Typography>
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#f6eaf0",
                        color: "#94456a",
                        width: 40,
                        height: 40,
                        borderRadius: 2.5,
                      }}
                    >
                      <Inventory2RoundedIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    {metrics.totalInventoryUnits} total units in stock
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Secondary Stats Row */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: "#192b21", mb: 2 }}>
                    Fulfillment Pipeline
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <PendingActionsRoundedIcon fontSize="small" sx={{ color: "#ed6c02" }} />
                        <Typography variant="body2">Pending Review</Typography>
                      </Stack>
                      <Chip label={statusBreakdown.pending + (statusBreakdown.confirmed || 0)} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <SyncRoundedIcon fontSize="small" sx={{ color: "#c28835" }} />
                        <Typography variant="body2">Processing</Typography>
                      </Stack>
                      <Chip label={statusBreakdown.processing} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <LocalShippingRoundedIcon fontSize="small" sx={{ color: "#0288d1" }} />
                        <Typography variant="body2">Shipped</Typography>
                      </Stack>
                      <Chip label={statusBreakdown.shipped} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <TaskAltRoundedIcon fontSize="small" sx={{ color: "#2e7d32" }} />
                        <Typography variant="body2">Delivered</Typography>
                      </Stack>
                      <Chip label={statusBreakdown.delivered} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: "#192b21", mb: 2 }}>
                    Store Categories & Taxonomy
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "#e8f0eb", color: "#25533a", width: 48, height: 48 }}>
                      <CategoryRoundedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#192b21" }}>
                        {metrics.totalCategories}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#647469" }}>
                        Active categories defined
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    component={Link}
                    href="/admin/categories"
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{ p: 0, fontWeight: 600, color: "#174c3a" }}
                  >
                    Manage Categories
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: "#192b21", mb: 2 }}>
                    Registered Customers
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "#eff4f0", color: "#2d5e43", width: 48, height: 48 }}>
                      <PeopleAltRoundedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#192b21" }}>
                        {metrics.totalCustomers}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#647469" }}>
                        Registered customer accounts
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#748479", display: "block", mb: 2 }}>
                    Profiles created through registration and Google OAuth.
                  </Typography>
                  <Button
                    component={Link}
                    href="/admin/users"
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{ p: 0, fontWeight: 600, color: "#174c3a" }}
                  >
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sales Trend Chart Section */}
          <Card sx={{ mb: 3.5 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <ShowChartRoundedIcon sx={{ color: "#174c3a" }} />
                    <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                      Sales Trend (Recorded Periods)
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#647469", mt: 0.5 }}>
                    Monthly revenue trajectory calculated directly from recorded orders in your database.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Chip
                    label={`${salesTrend.length} month(s) recorded`}
                    size="small"
                    sx={{ backgroundColor: "#eef2ec", color: "#284b38", fontWeight: 600 }}
                  />
                  <Button
                    component={Link}
                    href="/admin/sales"
                    size="small"
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      borderColor: "#d0d9cc",
                      color: "#284b38",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      "&:hover": { borderColor: "#174c3a" },
                    }}
                  >
                    View Full Analytics
                  </Button>
                </Stack>
              </Box>

              {salesTrend.length === 0 ? (
                <Box sx={{ py: 6, px: 3, textAlign: "center" }}>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 1.5,
                      bgcolor: "#eef2ec",
                      color: "#53735e",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <ShowChartRoundedIcon />
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#192b21" }}>
                    No Order Sales in Database Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#647469", maxWidth: 420, mx: "auto", mt: 0.5 }}>
                    Once orders are placed by customers, this graph will automatically plot revenue trends across all recorded transaction periods.
                  </Typography>
                </Box>
              ) : salesTrend.length === 1 ? (
                /* When only 1 period exists in DB, a bar chart shows the actual volume & revenue clearly */
                <Box sx={{ width: "100%", height: 320, minHeight: 320, pt: 1 }}>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={salesTrend.map(item => ({
                        name: item.label || item.period,
                        Sales: item.amount,
                        Orders: item.orderCount,
                      }))}
                      margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8ede7" />
                      <XAxis dataKey="name" stroke="#748479" fontSize={13} tickLine={false} />
                      <YAxis
                        stroke="#748479"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <RechartTooltip
                        formatter={(value: any, name: any) => [
                          name === "Sales" ? formatCurrency(Number(value) || 0) : value,
                          name,
                        ]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #d5ded3",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />
                      <Bar dataKey="Sales" fill="#174c3a" radius={[6, 6, 0, 0]} maxBarSize={90} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                /* Multi-period area graph */
                <Box sx={{ width: "100%", height: 320, minHeight: 320, pt: 1 }}>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart
                      data={salesTrend.map(item => ({
                        period: item.label || item.period,
                        amount: item.amount,
                        orderCount: item.orderCount,
                      }))}
                      margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#174c3a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#174c3a" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8ede7" />
                      <XAxis
                        dataKey="period"
                        stroke="#748479"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#748479"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <RechartTooltip
                        formatter={(value: any) => [formatCurrency(Number(value) || 0), "Revenue"]}
                        labelFormatter={(label) => `Period: ${label}`}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #d5ded3",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#174c3a"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#salesGradient)"
                        dot={{ r: 4, fill: "#174c3a" }}
                        activeDot={{ r: 6, fill: "#286040" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders Section */}
          <Card sx={{ mb: 3.5 }}>
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1.5,
                borderBottom: "1px solid #edf0eb",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                  Recent Orders ({recentOrders.length})
                </Typography>
                <Typography variant="body2" sx={{ color: "#647469" }}>
                  Live orders placed by store customers via Cash on Delivery
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/orders"
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderColor: "#d5ded3",
                  color: "#284b38",
                  "&:hover": { borderColor: "#174c3a" },
                }}
              >
                Manage All Orders
              </Button>
            </Box>

            {recentOrders.length === 0 ? (
              <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 2,
                    bgcolor: "#eef2ec",
                    color: "#53735e",
                    width: 56,
                    height: 56,
                  }}
                >
                  <ShoppingBagRoundedIcon fontSize="medium" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#192b21" }}>
                  No Customer Orders Placed Yet
                </Typography>
                <Typography variant="body2" sx={{ color: "#647469", maxWidth: 440, mx: "auto", mt: 0.5, mb: 2.5 }}>
                  Orders placed through the store checkout (Cash on Delivery or online) will automatically appear here with customer and item details.
                </Typography>
                <Button
                  component={Link}
                  href="/shop"
                  target="_blank"
                  variant="contained"
                  size="small"
                  startIcon={<StorefrontRoundedIcon />}
                >
                  Visit Store to Place Test Order
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Fulfillment</TableCell>
                      <TableCell align="right">Receipt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => {
                      const chipProps = getStatusChipProps(order.status);
                      const initials = order.customerName
                        ? order.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "CU";

                      return (
                        <TableRow key={order.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell sx={{ fontWeight: 700, color: "#174c3a" }}>
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  fontSize: "0.75rem",
                                  bgcolor: "#e8ede7",
                                  color: "#30553e",
                                  fontWeight: 600,
                                }}
                              >
                                {initials}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#192b21" }}>
                                  {order.customerName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#748479" }}>
                                  {order.customerEmail || order.customerPhone}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ color: "#647469", fontSize: "0.8125rem" }}>
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#192b21" }}>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.paymentMethod.toUpperCase()}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.6875rem", fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              {...chipProps}
                              size="small"
                              sx={{ fontSize: "0.6875rem", fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              component={Link}
                              href={`/orders/${order.orderNumber}/success`}
                              target="_blank"
                              size="small"
                              startIcon={<ReceiptLongRoundedIcon fontSize="small" />}
                              sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#174c3a" }}
                            >
                              Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          {/* Products & Inventory Section */}
          <Card>
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1.5,
                borderBottom: "1px solid #edf0eb",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                  Store Products & Inventory
                </Typography>
                <Typography variant="body2" sx={{ color: "#647469" }}>
                  Live catalog items, unit pricing, and stock levels
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/product"
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  borderColor: "#d5ded3",
                  color: "#284b38",
                  "&:hover": { borderColor: "#174c3a" },
                }}
              >
                All Products ({metrics.totalProducts})
              </Button>
            </Box>

            {productsSummary.length === 0 ? (
              <Box sx={{ py: 6, px: 3, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#647469", mb: 2 }}>
                  No products added to the catalog yet.
                </Typography>
                <Button
                  component={Link}
                  href="/admin/add-product"
                  variant="contained"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                >
                  Create Your First Product
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock Level</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsSummary.map((product) => {
                      const isOutOfStock = product.quantity === 0;
                      const isLowStock = product.quantity > 0 && product.quantity < 5;

                      return (
                        <TableRow key={product.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                              {product.image ? (
                                <Box
                                  component="img"
                                  src={product.image}
                                  alt={product.name}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    bgcolor: "#f0f2ee",
                                  }}
                                />
                              ) : (
                                <Avatar sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#eef2ec" }}>
                                  <Inventory2RoundedIcon fontSize="small" sx={{ color: "#50705b" }} />
                                </Avatar>
                              )}
                              <Box>
                                <Typography
                                  component={Link}
                                  href={`/product/${product.slug}`}
                                  target="_blank"
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#192b21",
                                    textDecoration: "none",
                                    "&:hover": { color: "#174c3a", textDecoration: "underline" },
                                  }}
                                >
                                  {product.name}
                                </Typography>
                                {product.isFeatured && (
                                  <Typography variant="caption" sx={{ display: "block", color: "#c28835", fontWeight: 600 }}>
                                    ★ Featured Product
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.categoryName}
                              size="small"
                              sx={{
                                backgroundColor: "#edf1ec",
                                color: "#375945",
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#192b21" }}>
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ minWidth: 100 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {product.quantity} units
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(100, (product.quantity / 30) * 100)}
                                color={isOutOfStock ? "error" : isLowStock ? "warning" : "primary"}
                                sx={{ height: 6, borderRadius: 3, bgcolor: "#edf0eb" }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            {isOutOfStock ? (
                              <Chip label="Out of Stock" size="small" color="error" />
                            ) : isLowStock ? (
                              <Chip label="Low Stock" size="small" color="warning" />
                            ) : (
                              <Chip label="In Stock" size="small" color="success" />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              component={Link}
                              href={`/admin/product/${product.id}/edit`}
                              size="small"
                              sx={{ color: "#546e5f" }}
                            >
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
