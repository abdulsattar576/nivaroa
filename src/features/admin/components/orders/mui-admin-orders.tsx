"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Card,
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
  Divider,
  Tooltip,
  Stack,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
} from "@mui/material";

// Professional Rounded Icons
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import { adminTheme } from "../../theme/mui-admin-theme";
import { updateOrderStatus } from "@/features/orders/actions/orders";
import type { OrderStatus } from "@/features/orders/schemas/order.schema";

export type AdminOrderItem = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl: string | null;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string | null;
  orderNotes: string | null;
  paymentMethod: string;
  paymentStatus: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  items: AdminOrderItem[];
};

interface MuiAdminOrdersProps {
  orders: AdminOrder[];
}

export function MuiAdminOrders({ orders }: MuiAdminOrdersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const filteredOrders = orders.filter((o) => {
    if (selectedTab === "all") return true;
    return o.status === selectedTab;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      setUpdatingId(null);
      if (result.success) {
        setToastMessage(`Order status updated to ${newStatus}.`);
        router.refresh();
      } else {
        setToastMessage(result.message || "Failed to update order status.");
      }
    });
  };

  const getStatusChip = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <Chip label="Delivered" size="small" color="success" icon={<TaskAltRoundedIcon fontSize="small" />} />;
      case "shipped":
        return <Chip label="Shipped" size="small" color="info" icon={<LocalShippingRoundedIcon fontSize="small" />} />;
      case "processing":
        return <Chip label="Processing" size="small" color="secondary" icon={<SyncRoundedIcon fontSize="small" />} />;
      case "confirmed":
        return <Chip label="Confirmed" size="small" color="primary" icon={<TaskAltRoundedIcon fontSize="small" />} />;
      case "cancelled":
        return <Chip label="Cancelled" size="small" color="error" icon={<CancelRoundedIcon fontSize="small" />} />;
      case "pending":
      default:
        return <Chip label="Pending" size="small" color="warning" icon={<PendingActionsRoundedIcon fontSize="small" />} />;
    }
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f8f5", px: { xs: 2, sm: 4, lg: 5 }, py: 3 }}>
        <Box sx={{ maxWidth: 1440, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Button
                component={Link}
                href="/admin"
                size="small"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{ mb: 1, color: "#546e5f", fontWeight: 600 }}
              >
                Back to Dashboard
              </Button>
              <Typography variant="h4" sx={{ color: "#192b21" }}>
                Order Management ({orders.length})
              </Typography>
              <Typography variant="body2" sx={{ color: "#647469", mt: 0.5 }}>
                Review live customer orders, verify Cash on Delivery shipping details, and update fulfillment milestones.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Tooltip title="Refresh orders">
                <IconButton
                  onClick={() => router.refresh()}
                  sx={{ backgroundColor: "#ffffff", border: "1px solid #e3e8e1" }}
                >
                  <SyncRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Orders Table Container */}
          <Card>
            {/* Filter Tabs */}
            <Box sx={{ borderBottom: "1px solid #edf0eb", px: 2.5, pt: 1 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, val) => setSelectedTab(val)}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label={`All (${orders.length})`} value="all" sx={{ fontWeight: 600 }} />
                <Tab
                  label={`Pending (${orders.filter((o) => o.status === "pending").length})`}
                  value="pending"
                  sx={{ fontWeight: 600 }}
                />
                <Tab
                  label={`Processing (${orders.filter((o) => o.status === "processing").length})`}
                  value="processing"
                  sx={{ fontWeight: 600 }}
                />
                <Tab
                  label={`Shipped (${orders.filter((o) => o.status === "shipped").length})`}
                  value="shipped"
                  sx={{ fontWeight: 600 }}
                />
                <Tab
                  label={`Delivered (${orders.filter((o) => o.status === "delivered").length})`}
                  value="delivered"
                  sx={{ fontWeight: 600 }}
                />
                <Tab
                  label={`Cancelled (${orders.filter((o) => o.status === "cancelled").length})`}
                  value="cancelled"
                  sx={{ fontWeight: 600 }}
                />
              </Tabs>
            </Box>

            {filteredOrders.length === 0 ? (
              <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
                <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "#eef2ec", color: "#53735e", width: 56, height: 56 }}>
                  <ShoppingBagRoundedIcon fontSize="medium" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#192b21" }}>
                  No Orders Found
                </Typography>
                <Typography variant="body2" sx={{ color: "#647469", maxWidth: 440, mx: "auto", mt: 0.5 }}>
                  {selectedTab === "all"
                    ? "No customer orders have been placed in the database yet."
                    : `No orders currently marked as '${selectedTab}'.`}
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Update Status</TableCell>
                      <TableCell align="right">Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const isUpdating = updatingId === order.id;

                      return (
                        <TableRow key={order.id} hover>
                          <TableCell sx={{ fontWeight: 700, color: "#174c3a" }}>
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#192b21" }}>
                              {order.customerName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#748479", display: "block" }}>
                              {order.customerEmail || "No email"}
                            </Typography>
                            {order.customerPhone && (
                              <Typography variant="caption" sx={{ color: "#748479", display: "block" }}>
                                {order.customerPhone}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ color: "#647469", fontSize: "0.8125rem" }}>
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: "#2d3d33" }}>
                              {order.city}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#748479", maxWidth: 160, display: "block" }} noWrap>
                              {order.shippingAddress}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#192b21" }}>
                            {formatCurrency(order.totalAmount)}
                            <Typography variant="caption" sx={{ display: "block", color: "#647469", fontWeight: 500 }}>
                              {order.paymentMethod.toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell>{getStatusChip(order.status)}</TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={order.status}
                                disabled={isUpdating || isPending}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value as OrderStatus)
                                }
                                sx={{ fontSize: "0.8125rem", height: 32 }}
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="confirmed">Confirmed</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                            {isUpdating && <CircularProgress size={16} sx={{ ml: 1, verticalAlign: "middle" }} />}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => setActiveOrder(order)}
                              sx={{ color: "#174c3a" }}
                            >
                              <VisibilityRoundedIcon fontSize="small" />
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

        {/* Order Details Dialog */}
        <Dialog
          open={Boolean(activeOrder)}
          onClose={() => setActiveOrder(null)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 3 } } }}
        >
          {activeOrder && (
            <>
              <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Order {activeOrder.orderNumber}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#647469" }}>
                    Placed on {formatDate(activeOrder.createdAt)}
                  </Typography>
                </Box>
                <IconButton onClick={() => setActiveOrder(null)} size="small">
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                {/* Customer & Shipping Details */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Shipping & Customer Info
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f9faf8", borderRadius: 2, mb: 2.5, border: "1px solid #edf0eb" }}>
                  <Typography variant="body2">
                    <strong>Recipient:</strong> {activeOrder.customerName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {activeOrder.customerEmail || "Not provided"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {activeOrder.customerPhone || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Address:</strong> {activeOrder.shippingAddress}, {activeOrder.city}{" "}
                    {activeOrder.postalCode ? `(${activeOrder.postalCode})` : ""}
                  </Typography>
                  {activeOrder.orderNotes && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "#647469" }}>
                      <strong>Customer Notes:</strong> {activeOrder.orderNotes}
                    </Typography>
                  )}
                </Box>

                {/* Items */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Line Items ({activeOrder.items.length})
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                  {activeOrder.items.length === 0 ? (
                    <Typography variant="caption" sx={{ color: "#647469", fontStyle: "italic" }}>
                      No separate line items recorded for this order.
                    </Typography>
                  ) : (
                    activeOrder.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1.5,
                          border: "1px solid #edf0eb",
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          {item.imageUrl ? (
                            <Box
                              component="img"
                              src={item.imageUrl}
                              alt={item.productName}
                              sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: "cover" }}
                            />
                          ) : (
                            <Avatar sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: "#edf1ec" }}>
                              <ShoppingBagRoundedIcon fontSize="small" sx={{ color: "#325c44" }} />
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.productName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#647469" }}>
                              {formatCurrency(item.price)} × {item.quantity}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.total)}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Stack>

                {/* Payment Breakdown */}
                <Divider sx={{ my: 1.5 }} />
                <Stack spacing={0.5}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal:
                    </Typography>
                    <Typography variant="body2">{formatCurrency(activeOrder.subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping Fee:
                    </Typography>
                    <Typography variant="body2">{formatCurrency(activeOrder.shippingFee)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Total Amount:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#174c3a" }}>
                      {formatCurrency(activeOrder.totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                  component={Link}
                  href={`/orders/${activeOrder.orderNumber}/success`}
                  target="_blank"
                  variant="outlined"
                  size="small"
                  startIcon={<ReceiptLongRoundedIcon fontSize="small" />}
                >
                  View Public Receipt
                </Button>
                <Button onClick={() => setActiveOrder(null)} variant="contained" color="primary" size="small">
                  Done
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Feedback Snackbar */}
        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={4000}
          onClose={() => setToastMessage(null)}
          message={toastMessage}
        />
      </Box>
    </ThemeProvider>
  );
}
