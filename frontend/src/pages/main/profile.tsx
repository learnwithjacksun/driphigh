import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { User, MapPin, Phone, Mail, Edit2, Save, X, LogOut } from "lucide-react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const initialProfile: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+234 123 456 7890",
  address: {
    street: "123 Main Street",
    city: "Uyo",
    state: "Akwa Ibom",
    zipCode: "520001",
    country: "Nigeria",
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(initialProfile);

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
    // Here you would typically save to API
  };

  const handleChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditedProfile({
        ...editedProfile,
        [parent]: {
          ...editedProfile[parent as keyof UserProfile] as { [key: string]: string },
          [child]: value,
        },
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const handleLogout = () => {
    // Clear user session/token
    // localStorage.removeItem('authToken');
    // Clear cart if needed
    // clearCart();
    
    // Navigate to home page
    navigate("/");
    
    // In a real app, you would also:
    // - Clear authentication state
    // - Clear user data from store
    // - Call logout API endpoint
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-main uppercase font-space mb-2">
                My Profile
              </h1>
              <p className="text-muted text-sm md:text-base">
                Manage your personal information and address
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
              >
                <Edit2 size={18} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details Card */}
              <div className="bg-secondary p-6 md:p-8">
                <h2 className="text-xl font-semibold text-main uppercase font-space mb-6 flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{profile.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-main uppercase font-space mb-2">
                      <Mail size={16} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{profile.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-main uppercase font-space mb-2">
                      <Phone size={16} />
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{profile.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-secondary p-6 md:p-8">
                <h2 className="text-xl font-semibold text-main uppercase font-space mb-6 flex items-center gap-2">
                  <MapPin size={20} />
                  Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.address.street}
                        onChange={(e) => handleChange("address.street", e.target.value)}
                        className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                      />
                    ) : (
                      <p className="text-muted">{profile.address.street}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.city}
                          onChange={(e) => handleChange("address.city", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{profile.address.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.state}
                          onChange={(e) => handleChange("address.state", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{profile.address.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        Zip Code
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.zipCode}
                          onChange={(e) => handleChange("address.zipCode", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{profile.address.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-main uppercase font-space mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address.country}
                          onChange={(e) => handleChange("address.country", e.target.value)}
                          className="w-full px-4 py-2 border border-line bg-background text-main focus:outline-none focus:border-main transition-colors"
                        />
                      ) : (
                        <p className="text-muted">{profile.address.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <div className="bg-secondary p-6">
                <h3 className="text-lg font-semibold text-main uppercase font-space mb-4">
                  Account Summary
                </h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted">Member Since</span>
                    <span className="text-main font-semibold">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total Orders</span>
                    <span className="text-main font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Cart Items</span>
                    <span className="text-main font-semibold">0</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 font-space font-semibold uppercase text-sm hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
