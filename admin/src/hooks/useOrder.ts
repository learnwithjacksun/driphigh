import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/config/api";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

interface OrderResponse {
  success: boolean;
  message: string;
  order?: IOrder;
  orders?: IOrder[];
  count?: number;
}

export default function useOrder() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Get all orders (admin only)
  const getAllOrders = async (
    status?: OrderStatus,
    paymentStatus?: PaymentStatus,
    userId?: string
  ): Promise<IOrder[]> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);
      if (userId) params.append("userId", userId);

      const response = await api.get<OrderResponse>(
        `/v1/orders/all${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (response.data.success) {
        return response.data.orders || [];
      }
      return [];
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to fetch orders";
      toast.error(errorMessage);
      return [];
    }
  };

  // Get single order by ID
  const getOrderById = async (orderId: string): Promise<IOrder> => {
    try {
      const response = await api.get<OrderResponse>(`/v1/orders/${orderId}`);

      if (response.data.success && response.data.order) {
        return response.data.order;
      }
      throw new Error("Order not found");
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to fetch order";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update order status (admin only)
  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus
  ): Promise<IOrder | undefined> => {
    setLoading(true);
    try {
      const response = await api.patch<OrderResponse>(`/v1/orders/${orderId}/status`, { status });

      if (response.data.success && response.data.order) {
        toast.success("Order status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        return response.data.order;
      }
      throw new Error("Failed to update order status");
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to update order status";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update payment status (admin only)
  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus
  ): Promise<IOrder | undefined> => {
    setLoading(true);
    try {
      const response = await api.patch<OrderResponse>(`/v1/orders/${orderId}/payment-status`, {
        paymentStatus,
      });

      if (response.data.success && response.data.order) {
        toast.success("Payment status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
        return response.data.order;
      }
      throw new Error("Failed to update payment status");
    } catch (error: unknown) {
      const errorMessage =
        (error as unknown as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Failed to update payment status";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // React Query hooks for fetching orders
  const useAllOrders = (
    status?: OrderStatus,
    paymentStatus?: PaymentStatus,
    userId?: string
  ) => {
    return useQuery({
      queryKey: ["orders", "all", status, paymentStatus, userId],
      queryFn: () => getAllOrders(status, paymentStatus, userId),
    });
  };

  const useOrder = (orderId: string) => {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderById(orderId),
      enabled: !!orderId,
    });
  };

  return {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    useAllOrders,
    useOrder,
    loading,
  };
}
