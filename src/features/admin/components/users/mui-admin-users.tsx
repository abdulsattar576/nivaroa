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
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";

// Professional Rounded Icons
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import { adminTheme } from "../../theme/mui-admin-theme";
import type { AdminUsersData, AdminUserListItem } from "../../services/users-service";

interface MuiAdminUsersProps {
  data: AdminUsersData;
}

export function MuiAdminUsers({ data }: MuiAdminUsersProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");

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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Filter users by search term and role
  const filteredUsers = data.users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesRole;

    const matchesName = user.fullName.toLowerCase().includes(term);
    const matchesEmail = user.email?.toLowerCase().includes(term);
    const matchesPhone = user.phone?.toLowerCase().includes(term);
    const matchesId = user.id.toLowerCase().includes(term);

    return matchesRole && (matchesName || matchesEmail || matchesPhone || matchesId);
  });

  const { metrics } = data;

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
                  Customer Management
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
                Registered Users & Customers
              </Typography>
              <Typography variant="body2" sx={{ color: "#647469", mt: 0.5 }}>
                Manage customer accounts, view order activity, and inspect system roles.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Tooltip title="Refresh user records">
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
                href="/admin/orders"
                variant="outlined"
                startIcon={<ShoppingBagRoundedIcon />}
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
                View Orders
              </Button>
            </Stack>
          </Box>

          {/* Metric KPI Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            {/* Total Users */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Total Accounts
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {metrics.totalUsers}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#eff4f0",
                        color: "#2d5e43",
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                      }}
                    >
                      <PeopleAltRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Registered authentication profiles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Customers */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Customers
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#174c3a" }}>
                        {metrics.customerCount}
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
                      <PersonOutlineRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Store shoppers & buyers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Buyers */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Active Buyers
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {metrics.activeBuyersCount}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: "#eef1fa",
                        color: "#475993",
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                      }}
                    >
                      <ShoppingBagRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Customers with ≥ 1 order placed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Administrators */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: "#6e7e73", fontWeight: 500 }}>
                        Administrators
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1, fontWeight: 700, color: "#192b21" }}>
                        {metrics.adminCount}
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
                      <AdminPanelSettingsRoundedIcon />
                    </Avatar>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#7f8f83", display: "block", mt: 1.5 }}>
                    Store administrative privileges
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* User Records Table Card */}
          <Card>
            {/* Filter and Search Bar */}
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid #edf0eb",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <TextField
                placeholder="Search user by name, email, or phone..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: { xs: "100%", sm: 380 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" sx={{ color: "#748479" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Button
                  size="small"
                  variant={roleFilter === "all" ? "contained" : "outlined"}
                  onClick={() => setRoleFilter("all")}
                  sx={{
                    fontSize: "0.75rem",
                    borderColor: "#d5ded3",
                    color: roleFilter === "all" ? "#ffffff" : "#284b38",
                  }}
                >
                  All ({metrics.totalUsers})
                </Button>
                <Button
                  size="small"
                  variant={roleFilter === "user" ? "contained" : "outlined"}
                  onClick={() => setRoleFilter("user")}
                  sx={{
                    fontSize: "0.75rem",
                    borderColor: "#d5ded3",
                    color: roleFilter === "user" ? "#ffffff" : "#284b38",
                  }}
                >
                  Customers ({metrics.customerCount})
                </Button>
                <Button
                  size="small"
                  variant={roleFilter === "admin" ? "contained" : "outlined"}
                  onClick={() => setRoleFilter("admin")}
                  sx={{
                    fontSize: "0.75rem",
                    borderColor: "#d5ded3",
                    color: roleFilter === "admin" ? "#ffffff" : "#284b38",
                  }}
                >
                  Admins ({metrics.adminCount})
                </Button>
              </Stack>
            </Box>

            {filteredUsers.length === 0 ? (
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
                  <PeopleAltRoundedIcon fontSize="medium" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#192b21" }}>
                  No User Accounts Found
                </Typography>
                <Typography variant="body2" sx={{ color: "#647469", maxWidth: 440, mx: "auto", mt: 0.5 }}>
                  {searchTerm
                    ? `No accounts matched your search "${searchTerm}".`
                    : "No user accounts registered yet in your database."}
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined Date</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Total Spent</TableCell>
                      <TableCell align="right">Last Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const initials = user.fullName
                        ? user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "US";

                      return (
                        <TableRow key={user.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  fontSize: "0.8125rem",
                                  bgcolor: user.role === "admin" ? "#fbf2e3" : "#e8ede7",
                                  color: user.role === "admin" ? "#976722" : "#30553e",
                                  fontWeight: 700,
                                }}
                              >
                                {initials}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#192b21" }}>
                                  {user.fullName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#748479", display: "block" }}>
                                  {user.email || user.phone || `ID: ${user.id.slice(0, 8)}...`}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {user.role === "admin" ? (
                              <Chip
                                label="Admin"
                                size="small"
                                sx={{
                                  backgroundColor: "#fbf2e3",
                                  color: "#976722",
                                  fontWeight: 700,
                                  fontSize: "0.6875rem",
                                }}
                              />
                            ) : (
                              <Chip
                                label="Customer"
                                size="small"
                                sx={{
                                  backgroundColor: "#e8f2e9",
                                  color: "#286040",
                                  fontWeight: 600,
                                  fontSize: "0.6875rem",
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ color: "#647469", fontSize: "0.8125rem" }}>
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {user.totalOrders}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: user.totalSpent > 0 ? "#174c3a" : "#748479" }}>
                            {formatCurrency(user.totalSpent)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "#647469", fontSize: "0.8125rem" }}>
                            {formatDate(user.lastOrderDate)}
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

