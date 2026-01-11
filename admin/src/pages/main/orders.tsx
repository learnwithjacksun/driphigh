import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Package, ArrowLeft, Eye, Calendar, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock, PackageCheck } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import { useState } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const { useAllOrders, updateOrderStatus, updatePaymentStatus, loading } = useOrder();
  const { data: orders = [], isLoading } = useAllOrders(
    selectedStatus === "all" ? undefined : selectedStatus,
    selectedPaymentStatus === "all" ? undefined : selectedPaymentStatus
  );

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updatePaymentStatus(orderId, newPaymentStatus);
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if payment status can be updated (only for non-prepaid orders)
  const canUpdatePaymentStatus = (order: IOrder) => {
    // Can't update if payment was completed via Paystack (pre-paid)
    if (order.paymentMethod === "paystack" && order.paymentStatus === "completed") {
      return false;
    }
    // Can update for delivery orders or pending Paystack payments
    return true;
  };

  // Get next available order statuses
  const getNextOrderStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["processing", "cancelled"];
      case "processing":
        return ["shipped", "cancelled"];
      case "shipped":
        return ["delivered"];
      case "delivered":
        return [];
      case "cancelled":
        return [];
      default:
        return [];
    }
  };

  // Get next available payment statuses
  const getNextPaymentStatuses = (currentStatus: PaymentStatus): PaymentStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["completed", "failed"];
      case "completed":
        return [];
      case "failed":
        return ["pending", "completed"];
      default:
        return [];
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "processing":
        return <Package size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <PackageCheck size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getPaymentStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "failed":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
              All Orders
            </h1>
            <p className="text-muted text-sm md:text-base">
              Manage and track all orders
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-muted font-space uppercase mb-2">
                Order Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | "all")}
                className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted font-space uppercase mb-2">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value as PaymentStatus | "all")}
                className="px-4 py-2 border border-line bg-background text-main font-space focus:outline-none focus:border-main transition-colors text-sm"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {isLoading || loading ? (
            <div className="text-center py-16">
              <p className="text-muted">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <Package size={48} className="text-muted" />
              </div>
              <h2 className="text-2xl font-bold text-main uppercase font-space mb-4">
                No Orders Found
              </h2>
              <p className="text-muted">
                No orders match your filter criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-secondary p-6 md:p-8 border border-line hover:border-main/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                            {order.name}
                          </h3>
                          <p className="text-sm text-muted font-space uppercase mb-1">
                            {order.category}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted mt-2">
                            <Calendar size={14} />
                            <span>Ordered on {formatDate(order.createdAt)}</span>
                          </div>
                          {typeof order.user === "object" && order.user && (
                            <p className="text-sm text-muted mt-2">
                              Customer: {order.user.firstName} {order.user.lastName} ({order.user.email})
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-main font-space mb-2">
                            ₦{order.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>

                      {/* Product Images */}
                      {order.images && order.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {order.images.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className="w-16 h-16 bg-background overflow-hidden border border-line relative"
                            >
                              <img
                                src={image}
                                alt={`${order.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.style.display = "none";
                                  const placeholder = img.nextElementSibling as HTMLElement;
                                  if (placeholder) {
                                    placeholder.style.display = "flex";
                                  }
                                }}
                              />
                              {/* Placeholder (hidden by default, shown on error) */}
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center absolute inset-0">
                                <span className="text-muted text-xs font-space uppercase text-center px-1">
                                  {order.name.substring(0, 10)}
                                </span>
                              </div>
                            </div>
                          ))}
                          {order.images.length > 3 && (
                            <div className="w-16 h-16 bg-background border border-line flex items-center justify-center">
                              <span className="text-xs text-muted font-space">
                                +{order.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted font-space uppercase text-xs mb-1 flex items-center gap-2">
                            <MapPin size={14} />
                            Delivery Address
                          </p>
                          <p className="text-main">
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted font-space uppercase text-xs mb-1 flex items-center gap-2">
                            {order.paymentMethod === "paystack" && order.paymentStatus === "completed" ? (
                              <CreditCard size={14} />
                            ) : (
                              <Truck size={14} />
                            )}
                            Payment Method
                          </p>
                          <p className="text-main font-space uppercase">
                            {order.paymentMethod === "paystack" && order.paymentStatus === "completed"
                              ? "Paystack (Paid)"
                              : order.paymentMethod === "paystack"
                              ? "Paystack (Pending)"
                              : "Pay on Delivery"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-line">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-main font-space font-semibold uppercase text-sm hover:text-main/80 transition-colors"
                      >
                        <Eye size={18} />
                        <span>View Details</span>
                      </Link>

                      {/* Status Update Buttons */}
                      <div className="flex flex-col gap-3">
                        {/* Order Status Update */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-muted font-space uppercase">Update Order Status</label>
                          <div className="flex flex-wrap gap-2">
                            {getNextOrderStatuses(order.status).map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusUpdate(order.id, status)}
                                disabled={updatingOrderId === order.id}
                                className={`flex items-center gap-2 px-4 py-2 border-2 font-space font-semibold uppercase text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  status === "cancelled"
                                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    : status === "delivered"
                                    ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                    : "border-main text-main hover:bg-main hover:text-background"
                                }`}
                              >
                                {getStatusIcon(status)}
                                <span>Mark as {status}</span>
                              </button>
                            ))}
                            {getNextOrderStatuses(order.status).length === 0 && (
                              <span className="px-4 py-2 text-sm text-muted font-space">
                                Order is {order.status}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Payment Status Update - Only show for non-prepaid orders */}
                        {canUpdatePaymentStatus(order) && (
                          <div className="flex flex-col gap-2">
                            <label className="text-xs text-muted font-space uppercase">Update Payment Status</label>
                            <div className="flex flex-wrap gap-2">
                              {getNextPaymentStatuses(order.paymentStatus).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handlePaymentStatusUpdate(order.id, status)}
                                  disabled={updatingOrderId === order.id}
                                  className={`flex items-center gap-2 px-4 py-2 border-2 font-space font-semibold uppercase text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    status === "failed"
                                      ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                      : status === "completed"
                                      ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                      : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                  }`}
                                >
                                  {getPaymentStatusIcon(status)}
                                  <span>Mark as {status}</span>
                                </button>
                              ))}
                              {getNextPaymentStatuses(order.paymentStatus).length === 0 && (
                                <span className="px-4 py-2 text-sm text-muted font-space">
                                  Payment is {order.paymentStatus}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
