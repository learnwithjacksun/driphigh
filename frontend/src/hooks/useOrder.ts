import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/config/api";
import { useState } from "react";
import { toast } from "sonner";
import useAuth from "./useAuth";

interface CreateOrderData {
  name: string;
  deliveryNote?: string;
  price: number;
  images: string[];
  category: string;
  sizes?: string;
  colors?: string;
  totalPrice: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
  };
  paymentMethod?: "questpay" | "delivery";
  paymentStatus?: "pending" | "completed" | "failed";
}

interface OrderResponse {
  success: boolean;
  message: string;
  order?: IOrder;
  orders?: IOrder[];
  count?: number;
  checkout_url?: string;
}

export default function useOrder() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Create order
  const createOrder = async (orderData: CreateOrderData): Promise<IOrder | undefined> => {
    setLoading(true);
    try {
      const response = await api.post<OrderResponse>("/v1/orders", orderData);

      if (response.data.success && response.data.order) {
        toast.success("Order created successfully");
        // Invalidate orders query to refetch
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        return response.data.order;
      }
      throw new Error("Failed to create order");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create order";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create order with payment
  const createOrderWithPayment = async (
    orderData: CreateOrderData,
    paymentMethod: "questpay" | "delivery"
  ): Promise<IOrder | undefined> => {
    if (paymentMethod === "delivery") {
      return createOrder({
        ...orderData,
        paymentMethod: "delivery",
        paymentStatus: "pending",
      });
    }

    if (!user?.email) {
      toast.error("Please login with a valid email to pay");
      throw new Error("User email required");
    }

    setLoading(true);
    try {
      const response = await api.post<OrderResponse>("/v1/orders", {
        ...orderData,
        paymentMethod: "questpay",
        paymentStatus: "pending",
      });

      if (response.data.success && response.data.order && response.data.checkout_url) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.info("Redirecting to QuestPay checkout...");
        window.location.href = response.data.checkout_url;
        return response.data.order;
      }

      throw new Error(
        response.data.message || "Failed to initialize payment"
      );
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Failed to initialize payment";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user orders
  const getUserOrders = async (status?: OrderStatus, paymentStatus?: PaymentStatus): Promise<IOrder[]> => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);

      const response = await api.get<OrderResponse>(
        `/v1/orders/my-orders${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (response.data.success) {
        return response.data.orders || [];
      }
      return [];
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
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
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to fetch order";
      toast.error(errorMessage);
      throw error;
    }
  };

  // React Query hooks for fetching orders
  const useUserOrders = (status?: OrderStatus, paymentStatus?: PaymentStatus) => {
    return useQuery({
      queryKey: ["orders", "user", status, paymentStatus],
      queryFn: () => getUserOrders(status, paymentStatus),
      enabled: !!user, // Only fetch if user is logged in
    });
  };

  const useOrder = (orderId: string) => {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderById(orderId),
      enabled: !!orderId && !!user, // Only fetch if orderId and user exist
    });
  };

  return {
    createOrder,
    createOrderWithPayment,
    getUserOrders,
    getOrderById,
    useUserOrders,
    useOrder,
    loading,
  };
}
