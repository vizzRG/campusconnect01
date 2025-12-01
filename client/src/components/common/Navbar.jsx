// client/src/components/common/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "./Avatar.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/questions?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Questions", path: "/questions" },
    { name: "Tags", path: "/tags" },
    { name: "Users", path: "/users" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg border-b border-dark-100 dark:border-dark-800">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 mx-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 bg-dark-100 dark:bg-dark-800 rounded-full focus:ring-2 focus:ring-[#faf5ff]0 outline-none transition-all text-dark-800 dark:text-dark-200"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#faf5ff]0 rounded-full" />
                </motion.button>

                <Link to="/ask">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:block btn-primary"
                  >
                    Ask Question
                  </motion.button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <Avatar src={user.avatar} name={user.username} size="sm" />
                    <span className="hidden md:block font-medium text-dark-700 dark:text-dark-200">
                      {user.username}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-100 dark:border-dark-700 overflow-hidden"
                      >
                        <Link
                          to={`/profile/${user._id}`}
                          className="block px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-dark-500">
                            {user.reputation} reputation
                          </div>
                        </Link>
                        <hr className="border-dark-100 dark:border-dark-700" />
                        <Link
                          to={`/profile/${user._id}`}
                          className="block px-4 py-2 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            navigate("/");
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-red-500"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-ghost"
                  >
                    Log in
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Sign up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-dark-600 dark:text-dark-300"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-dark-100 dark:border-dark-800"
            >
              <div className="py-4 space-y-2">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-2 mb-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions..."
                      className="w-full pl-10 pr-4 py-2 bg-dark-100 dark:bg-dark-800 rounded-lg focus:ring-2 focus:ring-[#faf5ff]0 outline-none"
                    />
                  </div>
                </form>

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 rounded-lg"
                  >
                    {link.name}
                  </Link>
                ))}

                {user && (
                  <Link
                    to="/ask"
                    onClick={() => setIsOpen(false)}
                    className="block mx-4 mt-4"
                  >
                    <button className="w-full btn-primary">Ask Question</button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
