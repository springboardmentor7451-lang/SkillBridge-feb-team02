import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuth from "../context/useAuth";

const Navbar = ({ openAuthModal }) => {
  const { isAuthenticated, logoutUser, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative">
      <nav className="w-[90%] mx-auto rounded-full flex justify-between items-center px-6 md:px-8 py-3 bg-white shadow-sm fixed top-7 left-1/2 -translate-x-1/2 z-40">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold text-slate-900 tracking-tighter no-underline z-50"
        >
          ServeSync
        </Link>

        <div className="hidden md:flex gap-5 items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg border-2 cursor-pointer">
                  {userInitial}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="px-6 py-2 rounded-full font-medium transition-colors bg-transparent text-slate-600 hover:text-slate-900 border-none cursor-pointer"
                onClick={() => openAuthModal("login")}
              >
                Log In
              </button>
              <button
                className="px-6 py-2.5 rounded-full font-medium transition-all bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 border-none cursor-pointer"
                onClick={() => openAuthModal("signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-slate-600 z-50 bg-transparent border-none cursor-pointer"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20 relative">
          <button
            className="absolute top-4 right-4 bg-transparent border rounded-full p-1 text-slate-500 z-10 hover:text-slate-600 transition-colors"
            onClick={toggleMenu}
          >
            <X className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <div className="flex flex-col gap-5 items-center w-full py-10">
              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex flex-col items-center gap-3 no-underline"
              >
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl border-2 border-indigo-200">
                  {userInitial}
                </div>
                <span className="text-xl font-semibold text-slate-800">
                  My Profile
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-8 py-3 rounded-full text-lg font-medium text-red-500 hover:bg-red-50 transition-colors bg-transparent border border-red-200 w-full max-w-xs cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 items-center w-full py-10">
              <button
                className="px-8 py-4 rounded-full text-xl font-medium w-full max-w-xs bg-slate-100 text-slate-800 hover:bg-slate-200"
                onClick={() => {
                  closeMenu();
                  openAuthModal("login");
                }}
              >
                Log In
              </button>

              <button
                className="px-8 py-4 rounded-full text-xl font-medium w-full max-w-xs bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                onClick={() => {
                  closeMenu();
                  openAuthModal("signup");
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
