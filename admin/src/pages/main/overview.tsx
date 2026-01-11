import { MainLayout } from "@/layouts";
import { Package, Users, ShoppingBag, TrendingUp, DollarSign, Clock } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import useUser from "@/hooks/useUser";
import useProduct from "@/hooks/useProduct";
import { useMemo } from "react";

export default function Overview() {
  const { useAllOrders } = useOrder();
  const { useAllUsers } = useUser();
  const { useAllProducts } = useProduct();

  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const { data: users = [], isLoading: usersLoading } = useAllUsers();
  const { data: products = [], isLoading: productsLoading } = useAllProducts();

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "completed")
      .reduce((sum, order) => sum + order.totalPrice, 0);

    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const processingOrders = orders.filter((order) => order.status === "processing").length;
    const completedOrders = orders.filter((order) => order.status === "delivered").length;

    const recentOrders = orders.slice(0, 5);

    return {
      totalOrders: orders.length,
      totalUsers: users.length,
      totalProducts: products.length,
      totalRevenue,
      pendingOrders,
      processingOrders,
      completedOrders,
      recentOrders,
    };
  }, [orders, users, products]);

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      change: "+12%",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-green-500/10 text-green-600 border-green-500/20",
      change: "+8%",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      change: "+5%",
    },
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      change: "+15%",
    },
  ];

  const orderStatusCards = [
    {
      title: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      title: "Processing",
      value: stats.processingOrders,
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Delivered",
      value: stats.completedOrders,
      icon: Package,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 ";
      case "processing":
        return "bg-blue-500/10 text-blue-600 ";
      case "shipped":
        return "bg-purple-500/10 text-purple-600";
      case "delivered":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  if (ordersLoading || usersLoading || productsLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-8">
            Dashboard Overview
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-secondary p-6 border border-line hover:border-main/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} `}>
                    <stat.icon size={24} />
                  </div>
                  <span className="text-xs text-muted font-space uppercase">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-main font-space mb-1">{stat.value}</h3>
                <p className="text-sm text-muted font-space uppercase">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Order Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {orderStatusCards.map((card, index) => (
              <div
                key={index}
                className="bg-secondary p-6 border border-line hover:border-main/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-main font-space mb-1">{card.value}</h3>
                    <p className="text-sm text-muted font-space uppercase">{card.title} Orders</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-secondary p-6 md:p-8 border border-line">
            <h2 className="text-xl font-semibold text-main uppercase font-space mb-6">
              Recent Orders
            </h2>
            {stats.recentOrders.length === 0 ? (
              <p className="text-muted text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-background border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-main font-space uppercase mb-1">
                        {order.name}
                      </h3>
                      <p className="text-sm text-muted">
                        {typeof order.user === "object" && order.user
                          ? `${order.user.firstName} ${order.user.lastName}`
                          : "Unknown User"}
                      </p>
                      <p className="text-xs text-muted mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-main font-space mb-2">
                        ₦{order.totalPrice.toLocaleString()}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

