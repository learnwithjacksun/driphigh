import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Users, Eye, Search, ArrowLeft } from "lucide-react";
import useUser from "@/hooks/useUser";
import { useState } from "react";

export default function UsersManagement() {
  const navigate = useNavigate();
  const { useAllUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading } = useAllUsers();

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <p className="text-muted">Loading users...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              Users Management
            </h1>
            <p className="text-muted text-sm md:text-base">
              Manage all registered users
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors font-space"
              />
            </div>
          </div>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <Users size={48} className="text-muted" />
              </div>
              <h2 className="text-2xl font-bold text-main uppercase font-space mb-4">
                No Users Found
              </h2>
              <p className="text-muted">
                {searchTerm ? "No users match your search criteria" : "No users registered yet"}
              </p>
            </div>
          ) : (
            <div className="bg-secondary p-2 md:p-8 border border-line">
              <div className="mb-4">
                <p className="text-sm text-muted font-space uppercase">
                  Total Users: {filteredUsers.length}
                </p>
              </div>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-background p-6 border border-line hover:border-main/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center">
                            <span className="text-main font-space font-semibold text-lg uppercase">
                              {user.firstName?.charAt(0) || ""}
                              {user.lastName?.charAt(0) || ""}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-main uppercase font-space">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-muted">{user.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-muted font-space uppercase text-xs mb-1">Phone</p>
                            <p className="text-main">{user.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted font-space uppercase text-xs mb-1">Address</p>
                            <p className="text-main">
                              {user.address?.street
                                ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted font-space uppercase text-xs mb-1">Status</p>
                            <span
                              className={`px-2 py-1 rounded text-xs font-space font-semibold ${
                                user.isVerified
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                          <div>
                            <p className="text-muted font-space uppercase text-xs mb-1">Joined</p>
                            <p className="text-main">{formatDate(user.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="flex items-center gap-2 px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors"
                        >
                          <Eye size={18} />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

