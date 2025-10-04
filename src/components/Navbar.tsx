import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const navLinks = isAuthenticated
    ? [
        { to: "/", label: "Home" },
        { to: "/qbank", label: "Qbank" },
        { to: "/submit", label: "Submit Question" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/qbank", label: "Qbank" },
        { to: "/login", label: "Login" },
      ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          recallQbank
        </Link>
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <ul className="hidden md:flex gap-4 items-center">
          {navLinks.map((link) => (
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
      </div>
      {open && (
        <ul className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {navLinks.map((link) => (
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
        </ul>
      )}
    </nav>
  );
};

export default Navbar;