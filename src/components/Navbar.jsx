import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { cn } from "@/lib/utils";
import { Menu, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/qbank", label: "Qbank" },
    { to: "/submit", label: "Submit Question", requiresAuth: true },
    { to: "/profile", label: "Profile", requiresAuth: true },
  ];

  const filteredNavLinks = user 
    ? navLinks 
    : navLinks.filter(link => !link.requiresAuth);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          recallQbank
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-4 items-center">
            {filteredNavLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition",
                    location.pathname === link.to
                      ? "bg-blue-100 dark:bg-blue-900 font-semibold"
                      : ""
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setOpen(!open)}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{user.username}</span>
              </button>
              
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {open && (
        <ul className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {filteredNavLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={cn(
                  "block px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition",
                  location.pathname === link.to
                    ? "bg-blue-100 dark:bg-blue-900 font-semibold"
                    : ""
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user && (
            <>
              <li>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;