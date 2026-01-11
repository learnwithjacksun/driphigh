import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
import Mobilebar from "./mobilebar";
import useAuth from "@/hooks/useAuth";

const navigationLinks = [
  { name: "Overview", path: "/overview", isPage: true },
  { name: "Orders", path: "/orders", isPage: true },
  { name: "Users", path: "/users", isPage: true },
  { name: "Products", path: "/products", isPage: true },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

 

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#000000] text-white backdrop-blur">
        <nav className="main h-[70px] flex items-center justify-between">
          
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <img
                src="/logo.jpeg"
                alt="Driphigh Logo"
                className="w-16 object-contain"
              />
            </Link>

            <div className="flex items-center gap-8">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 border-r-2 border-white/70 pr-8">
                  {navigationLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        isActive ? "text-white text-sm font-space uppercase font-semibold hover:text-yellow-400" : "text-white/50 text-sm font-space uppercase font-medium hover:text-yellow-400"
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>
                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                 
                  {/* User Icon */}
                 {!user && ( <Link
                    to="/auth"
                    className="center h-10 w-10 bg-[#212121] hover:bg-[#313131] rounded-full transition-colors duration-200"
                    aria-label="Account"
                  >
                    <UserRound size={20} />
                  </Link>)}

                  {user && (
                    <Link
                      to="/profile"
                      className="flex h-10 w-10 center bg-yellow-500 text-black font-space font-semibold text-sm uppercase rounded-full transition-colors duration-200"
                      aria-label="Profile"
                    >
                      {getUserInitials()}
                    </Link>
                  )}
                  {/* Mobile Menu Toggle */}
                  <div className="md:hidden">
                    <button
                      onClick={toggleMobileMenu}
                      className=" p-2 transition-colors duration-200"
                      aria-label="Toggle menu"
                      aria-expanded={isMobileMenuOpen}
                    >
                      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                </div>
            </div>
          
        </nav>
      </header>

      {/* Mobile Menu */}
      <Mobilebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
