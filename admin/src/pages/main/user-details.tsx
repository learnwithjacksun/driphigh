import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import useUser from "@/hooks/useUser";
import useOrder from "@/hooks/useOrder";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useUser: useUserQuery } = useUser();
  const { useAllOrders } = useOrder();

  const { data: user, isLoading: userIsLoading, error: userError } = useUserQuery(id || "");
  const { data: allOrders = [] } = useAllOrders();
  const userOrders = allOrders.filter(
    (order) => (typeof order.user === "object" ? order.user?.id : order.user) === id
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (userIsLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading user details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (userError || !user) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main text-center py-16">
            <h1 className="text-2xl font-bold text-main mb-4">User Not Found</h1>
            <Link
              to="/users"
              className="inline-block px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main max-w-4xl">
          <button
            onClick={() => navigate("/users")}
            className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Users</span>
          </button>

          {/* User Header */}
          <div className="bg-secondary p-6 md:p-8 mb-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-main/10 rounded-full flex items-center justify-center">
                <span className="text-main font-space font-semibold text-2xl uppercase">
                  {user.firstName?.charAt(0) || ""}
                  {user.lastName?.charAt(0) || ""}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  {user.isVerified ? (
                    <span className="px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border bg-green-500/10 text-green-600 border-green-500/20 flex items-center gap-2">
                      <CheckCircle size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border bg-yellow-500/10 text-yellow-600 border-yellow-500/20 flex items-center gap-2">
                      <XCircle size={14} />
                      Unverified
                    </span>
                  )}
                  {user.isAdmin && (
                    <span className="px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border bg-purple-500/10 text-purple-600 border-purple-500/20">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-muted mt-0.5" />
                <div>
                  <p className="text-muted font-space uppercase text-xs mb-1">Email</p>
                  <p className="text-main">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-muted mt-0.5" />
                <div>
                  <p className="text-muted font-space uppercase text-xs mb-1">Phone</p>
                  <p className="text-main">{user.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-muted mt-0.5" />
                <div>
                  <p className="text-muted font-space uppercase text-xs mb-1">Address</p>
                  <p className="text-main">
                    {user.address?.street
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-muted mt-0.5" />
                <div>
                  <p className="text-muted font-space uppercase text-xs mb-1">Joined</p>
                  <p className="text-main">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Orders */}
          <div className="bg-secondary p-6 md:p-8">
            <h2 className="text-xl font-semibold text-main uppercase font-space mb-6">
              User Orders ({userOrders.length})
            </h2>
            {userOrders.length === 0 ? (
              <p className="text-muted text-center py-8">No orders found for this user</p>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block bg-background p-4 border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-main font-space uppercase mb-1">
                          {order.name}
                        </h3>
                        <p className="text-sm text-muted">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-main font-space mb-2">
                          ₦{order.totalPrice.toLocaleString()}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-space font-semibold uppercase border ${
                            order.status === "delivered"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : order.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

