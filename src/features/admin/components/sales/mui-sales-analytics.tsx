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
  Stack,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// Professional Rounded Icons
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

// Custom SVG Ring Dot matching reference graph
function ReferenceRingDot(props: any) {
  const { cx, cy, stroke = "#174c3a" } = props;
  if (cx == null || cy == null) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={7.5} fill="#ffffff" />
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#ffffff"
        stroke={stroke}
        strokeWidth={3.5}
      />
    </g>
  );
}

function ActiveReferenceRingDot(props: any) {
  const { cx, cy, stroke = "#174c3a" } = props;
  if (cx == null || cy == null) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="#ffffff" />
      <circle
        cx={cx}
        cy={cy}
        r={7.5}
        fill="#ffffff"
        stroke={stroke}
        strokeWidth={4.5}
      />
    </g>
  );
}

import { adminTheme } from "../../theme/mui-admin-theme";
import type { SalesAnalyticsData } from "../../services/sales-analytics-service";

interface MuiSalesAnalyticsProps {
  data: SalesAnalyticsData;
}

export function MuiSalesAnalytics({ data }: MuiSalesAnalyticsProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    data.yearsAvailable[0] || new Date().getFullYear()
  );
  const [viewTab, setViewTab] = useState<"year_detail" | "all_years" | "all_months">("year_detail");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Find active yearly breakdown
  const activeYearData = data.yearlyBreakdowns.find((y) => y.year === selectedYear) || {
    year: selectedYear,
    totalSales: 0,
    orderCount: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    avgOrderValue: 0,
    monthlyBreakdown: [],
  };

  // Prepare chart data for selected year's 12 months
  const yearMonthlyChartData = activeYearData.monthlyBreakdown.map((m) => ({
    name: m.monthLabel.split(" ")[0], // e.g. "Jan"
    Sales: m.totalSales,
    Orders: m.orderCount,
  }));

  // Prepare chart data for year-over-year comparison
  const yearComparisonChartData = [...data.yearlyBreakdowns]
    .sort((a, b) => a.year - b.year)
    .map((y) => ({
      year: String(y.year),
      Sales: y.totalSales,
      Orders: y.orderCount,
    }));

  const { summary } = data;

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
                <Button
                  component={Link}
                  href="/admin"
                  size="small"
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={{ color: "#456350", p: 0, fontWeight: 600 }}
                >
                  Dashboard
                </Button>
                <Typography variant="caption" sx={{ color: "#a0aba3" }}>
                  /
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "primary.main",
                  }}
                >
                  Sales Analytics
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
                Monthly & Yearly Sales Performance
              </Typography>
              <Typography variant="body2" sx={{ color: "#647469", mt: 0.5 }}>
                Comprehensive revenue, order volume, and month-over-month growth analytics.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Tooltip title="Refresh live analytics">
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

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="year-select-label">Filter Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Filter Year"
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  sx={{ backgroundColor: "#ffffff" }}
                >
                  {data.yearsAvailable.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {/* Key Summary Metric Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            {/* Lifetime Revenue */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Lifetime Revenue
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {formatCurrency(summary.lifetimeRevenue)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#e8f2e9",
                        color: "#286040",
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                      }}
                    >
                      <AccountBalanceWalletRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    {summary.lifetimeOrders} total orders processed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* This Year Sales */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Year {new Date().getFullYear()} Sales
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#174c3a" }}>
                        {formatCurrency(summary.currentYearSales)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#eff3fc",
                        color: "#3557a6",
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                      }}
                    >
                      <DateRangeRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Current calendar year performance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* This Month Sales */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Current Month Sales
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {formatCurrency(summary.currentMonthSales)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#e5f4ee",
                        color: "#1c654e",
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                      }}
                    >
                      <CalendarTodayRoundedIcon />
                    </Avatar>
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 1.5 }}>
                    {summary.monthOverMonthGrowth >= 0 ? (
                      <TrendingUpRoundedIcon sx={{ color: "#2e7d32", fontSize: 16 }} />
                    ) : (
                      <TrendingDownRoundedIcon sx={{ color: "#d32f2f", fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: summary.monthOverMonthGrowth >= 0 ? "#2e7d32" : "#d32f2f",
                        fontWeight: 700,
                      }}
                    >
                      {summary.monthOverMonthGrowth >= 0 ? "+" : ""}
                      {summary.monthOverMonthGrowth.toFixed(1)}% MoM
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#7f8f83" }}>
                      vs last month ({formatCurrency(summary.previousMonthSales)})
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Selected Year Total */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%", borderColor: "#174c3a" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Selected Year ({selectedYear})
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {formatCurrency(activeYearData.totalSales)}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#fbf2e3",
                        color: "#976722",
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                      }}
                    >
                      <BarChartRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    {activeYearData.orderCount} orders • Avg: {formatCurrency(activeYearData.avgOrderValue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={viewTab}
              onChange={(_, val) => setViewTab(val)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                value="year_detail"
                label={`${selectedYear} Monthly Breakdown`}
                icon={<CalendarTodayRoundedIcon fontSize="small" />}
                iconPosition="start"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                value="all_years"
                label="Year-over-Year Summary"
                icon={<DateRangeRoundedIcon fontSize="small" />}
                iconPosition="start"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                value="all_months"
                label="All Recorded Months"
                icon={<ShowChartRoundedIcon fontSize="small" />}
                iconPosition="start"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            </Tabs>
          </Box>

          {/* Tab 1: Selected Year Monthly Breakdown */}
          {viewTab === "year_detail" && (
            <Stack spacing={3.5}>
              {/* Chart Card */}
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                        {selectedYear} Monthly Sales Trajectory
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#647469" }}>
                        Monthly revenue and order volume trajectory across {selectedYear}.
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Stack direction="row" sx={{ bgcolor: "#f0f4ee", p: 0.5, borderRadius: 2 }}>
                        <Button
                          size="small"
                          variant={chartType === "line" ? "contained" : "text"}
                          onClick={() => setChartType("line")}
                          startIcon={<ShowChartRoundedIcon fontSize="small" />}
                          sx={{
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.5,
                            bgcolor: chartType === "line" ? "#174c3a" : "transparent",
                            color: chartType === "line" ? "#ffffff" : "#4a6352",
                            "&:hover": { bgcolor: chartType === "line" ? "#123c2e" : "#e5ebe2" },
                          }}
                        >
                          Graph Line
                        </Button>
                        <Button
                          size="small"
                          variant={chartType === "bar" ? "contained" : "text"}
                          onClick={() => setChartType("bar")}
                          startIcon={<BarChartRoundedIcon fontSize="small" />}
                          sx={{
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.5,
                            bgcolor: chartType === "bar" ? "#174c3a" : "transparent",
                            color: chartType === "bar" ? "#ffffff" : "#4a6352",
                            "&:hover": { bgcolor: chartType === "bar" ? "#123c2e" : "#e5ebe2" },
                          }}
                        >
                          Bars
                        </Button>
                      </Stack>
                      <Chip
                        label={`Total: ${formatCurrency(activeYearData.totalSales)}`}
                        sx={{ bgcolor: "#e8f2e9", color: "#286040", fontWeight: 700 }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ width: "100%", height: 340, minHeight: 340 }}>
                    <ResponsiveContainer width="100%" height={340}>
                      {chartType === "line" ? (
                        <LineChart
                          data={yearMonthlyChartData}
                          margin={{ top: 15, right: 25, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid stroke="#e5eae3" strokeWidth={1.2} />
                          <XAxis
                            dataKey="name"
                            stroke="#546559"
                            fontSize={12}
                            tickLine={{ stroke: "#546559" }}
                            tick={{ fontWeight: 600 }}
                          />
                          <YAxis
                            yAxisId="left"
                            stroke="#174c3a"
                            fontSize={12}
                            tickLine={{ stroke: "#174c3a" }}
                            axisLine={{ stroke: "#174c3a", strokeWidth: 2 }}
                            tickFormatter={(val) => `$${val}`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#c28835"
                            fontSize={12}
                            tickLine={{ stroke: "#c28835" }}
                            axisLine={{ stroke: "#c28835", strokeWidth: 2 }}
                            allowDecimals={false}
                          />
                          <RechartTooltip
                            formatter={(value: any, name: any) => [
                              name === "Sales" ? formatCurrency(Number(value)) : value,
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #d5ded3",
                              borderRadius: "10px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              fontSize: "13px",
                            }}
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="linear"
                            dataKey="Sales"
                            stroke="#174c3a"
                            strokeWidth={3.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={<ReferenceRingDot stroke="#174c3a" />}
                            activeDot={<ActiveReferenceRingDot stroke="#174c3a" />}
                          />
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="Orders"
                            stroke="#c28835"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={<ReferenceRingDot stroke="#c28835" />}
                            activeDot={<ActiveReferenceRingDot stroke="#c28835" />}
                          />
                        </LineChart>
                      ) : (
                        <BarChart
                          data={yearMonthlyChartData}
                          margin={{ top: 15, right: 25, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e8ede7" />
                          <XAxis dataKey="name" stroke="#748479" fontSize={12} tickLine={false} />
                          <YAxis
                            yAxisId="left"
                            stroke="#748479"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val}`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#748479"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <RechartTooltip
                            formatter={(value: any, name: any) => [
                              name === "Sales" ? formatCurrency(Number(value)) : value,
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #d5ded3",
                              borderRadius: "8px",
                              fontSize: "13px",
                            }}
                          />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="Sales"
                            fill="#174c3a"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="Orders"
                            fill="#c28835"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              {/* Table Card */}
              <Card>
                <Box
                  sx={{
                    p: 2.5,
                    borderBottom: "1px solid #edf0eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                      Monthly Breakdown Table ({selectedYear})
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#647469" }}>
                      Detailed order counts, delivered rate, and average order value per month.
                    </Typography>
                  </Box>
                </Box>

                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Total Sales</TableCell>
                        <TableCell align="right">Total Orders</TableCell>
                        <TableCell align="right">Delivered</TableCell>
                        <TableCell align="right">Cancelled</TableCell>
                        <TableCell align="right">Avg. Order Value</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeYearData.monthlyBreakdown.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#8a968f" }}>
                            No orders recorded in database for {selectedYear}.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activeYearData.monthlyBreakdown.map((row) => (
                          <TableRow key={row.monthKey} hover>
                            <TableCell sx={{ fontWeight: 600, color: "#192b21" }}>
                              {row.monthLabel}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: "#174c3a" }}>
                              {formatCurrency(row.totalSales)}
                            </TableCell>
                            <TableCell align="right">{row.orderCount}</TableCell>
                            <TableCell align="right" sx={{ color: "#2e7d32" }}>
                              {row.deliveredOrders}
                            </TableCell>
                            <TableCell align="right" sx={{ color: row.cancelledOrders > 0 ? "#d32f2f" : "#8a968f" }}>
                              {row.cancelledOrders}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(row.avgOrderValue)}
                            </TableCell>
                            <TableCell align="center">
                              <Chip label="Recorded" size="small" color="success" sx={{ fontSize: "0.6875rem" }} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Stack>
          )}

          {/* Tab 2: All Years Summary */}
          {viewTab === "all_years" && (
            <Stack spacing={3.5}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                        Year-over-Year Annual Trajectory
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#647469" }}>
                        Comparison of annual revenue and order volume across calendar years.
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Stack direction="row" sx={{ bgcolor: "#f0f4ee", p: 0.5, borderRadius: 2 }}>
                        <Button
                          size="small"
                          variant={chartType === "line" ? "contained" : "text"}
                          onClick={() => setChartType("line")}
                          startIcon={<ShowChartRoundedIcon fontSize="small" />}
                          sx={{
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.5,
                            bgcolor: chartType === "line" ? "#174c3a" : "transparent",
                            color: chartType === "line" ? "#ffffff" : "#4a6352",
                            "&:hover": { bgcolor: chartType === "line" ? "#123c2e" : "#e5ebe2" },
                          }}
                        >
                          Graph Line
                        </Button>
                        <Button
                          size="small"
                          variant={chartType === "bar" ? "contained" : "text"}
                          onClick={() => setChartType("bar")}
                          startIcon={<BarChartRoundedIcon fontSize="small" />}
                          sx={{
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.5,
                            bgcolor: chartType === "bar" ? "#174c3a" : "transparent",
                            color: chartType === "bar" ? "#ffffff" : "#4a6352",
                            "&:hover": { bgcolor: chartType === "bar" ? "#123c2e" : "#e5ebe2" },
                          }}
                        >
                          Bars
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box sx={{ width: "100%", height: 340, minHeight: 340 }}>
                    <ResponsiveContainer width="100%" height={340}>
                      {chartType === "line" ? (
                        <LineChart
                          data={yearComparisonChartData}
                          margin={{ top: 15, right: 25, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid stroke="#e5eae3" strokeWidth={1.2} />
                          <XAxis
                            dataKey="year"
                            stroke="#546559"
                            fontSize={12}
                            tickLine={{ stroke: "#546559" }}
                            tick={{ fontWeight: 600 }}
                          />
                          <YAxis
                            yAxisId="left"
                            stroke="#174c3a"
                            fontSize={12}
                            tickLine={{ stroke: "#174c3a" }}
                            axisLine={{ stroke: "#174c3a", strokeWidth: 2 }}
                            tickFormatter={(val) => `$${val}`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#c28835"
                            fontSize={12}
                            tickLine={{ stroke: "#c28835" }}
                            axisLine={{ stroke: "#c28835", strokeWidth: 2 }}
                            allowDecimals={false}
                          />
                          <RechartTooltip
                            formatter={(value: any, name: any) => [
                              name === "Sales" ? formatCurrency(Number(value)) : value,
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #d5ded3",
                              borderRadius: "10px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              fontSize: "13px",
                            }}
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="linear"
                            dataKey="Sales"
                            stroke="#174c3a"
                            strokeWidth={3.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={<ReferenceRingDot stroke="#174c3a" />}
                            activeDot={<ActiveReferenceRingDot stroke="#174c3a" />}
                          />
                          <Line
                            yAxisId="right"
                            type="linear"
                            dataKey="Orders"
                            stroke="#c28835"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            dot={<ReferenceRingDot stroke="#c28835" />}
                            activeDot={<ActiveReferenceRingDot stroke="#c28835" />}
                          />
                        </LineChart>
                      ) : (
                        <BarChart
                          data={yearComparisonChartData}
                          margin={{ top: 15, right: 25, left: 10, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e8ede7" />
                          <XAxis dataKey="year" stroke="#748479" fontSize={12} tickLine={false} />
                          <YAxis
                            yAxisId="left"
                            stroke="#748479"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${val}`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#748479"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <RechartTooltip
                            formatter={(value: any, name: any) => [
                              name === "Sales" ? formatCurrency(Number(value)) : value,
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #d5ded3",
                              borderRadius: "8px",
                              fontSize: "13px",
                            }}
                          />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="Sales"
                            fill="#174c3a"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="Orders"
                            fill="#c28835"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <Box sx={{ p: 2.5, borderBottom: "1px solid #edf0eb" }}>
                  <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                    Annual Sales Performance Table
                  </Typography>
                </Box>
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Year</TableCell>
                        <TableCell align="right">Annual Revenue</TableCell>
                        <TableCell align="right">Total Orders</TableCell>
                        <TableCell align="right">Delivered</TableCell>
                        <TableCell align="right">Cancelled</TableCell>
                        <TableCell align="right">Avg. Order Value</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.yearlyBreakdowns.map((y) => (
                        <TableRow key={y.year} hover>
                          <TableCell sx={{ fontWeight: 700, color: "#174c3a" }}>
                            {y.year}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: "#192b21" }}>
                            {formatCurrency(y.totalSales)}
                          </TableCell>
                          <TableCell align="right">{y.orderCount}</TableCell>
                          <TableCell align="right" sx={{ color: "#2e7d32" }}>
                            {y.deliveredOrders}
                          </TableCell>
                          <TableCell align="right" sx={{ color: y.cancelledOrders > 0 ? "#d32f2f" : "#8a968f" }}>
                            {y.cancelledOrders}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(y.avgOrderValue)}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedYear(y.year);
                                setViewTab("year_detail");
                              }}
                              sx={{ fontSize: "0.75rem", borderColor: "#d0d9cc", color: "#284b38" }}
                            >
                              View Months
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Stack>
          )}

          {/* Tab 3: All Recorded Months */}
          {viewTab === "all_months" && (
            <Card>
              <Box sx={{ p: 2.5, borderBottom: "1px solid #edf0eb" }}>
                <Typography variant="h6" sx={{ color: "#192b21", fontWeight: 700 }}>
                  Historical Monthly Ledger ({data.allMonths.length} Active Periods)
                </Typography>
                <Typography variant="body2" sx={{ color: "#647469" }}>
                  Every calendar month with recorded customer transactions in chronological order.
                </Typography>
              </Box>

              {data.allMonths.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#748479" }}>
                    No order transactions recorded yet.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell align="right">Monthly Sales</TableCell>
                        <TableCell align="right">Total Orders</TableCell>
                        <TableCell align="right">Delivered</TableCell>
                        <TableCell align="right">Cancelled</TableCell>
                        <TableCell align="right">Avg. Order Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.allMonths.map((m) => (
                        <TableRow key={m.monthKey} hover>
                          <TableCell sx={{ fontWeight: 600, color: "#192b21" }}>
                            {m.monthLabel}
                          </TableCell>
                          <TableCell>
                            <Chip label={m.year} size="small" sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: "#174c3a" }}>
                            {formatCurrency(m.totalSales)}
                          </TableCell>
                          <TableCell align="right">{m.orderCount}</TableCell>
                          <TableCell align="right" sx={{ color: "#2e7d32" }}>
                            {m.deliveredOrders}
                          </TableCell>
                          <TableCell align="right" sx={{ color: m.cancelledOrders > 0 ? "#d32f2f" : "#8a968f" }}>
                            {m.cancelledOrders}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(m.avgOrderValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

