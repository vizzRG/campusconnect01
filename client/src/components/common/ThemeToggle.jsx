// client/src/components/common/ThemeToggle.jsx
import React from "react";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../hooks/useTheme.js";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-dark-200 dark:bg-dark-700 rounded-full p-1 transition-colors duration-300"
    >
      <motion.div
        className="absolute w-5 h-5 bg-white dark:bg-[#faf5ff]0 rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: isDark ? 26 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <MoonIcon className="w-3 h-3 text-white" />
        ) : (
          <SunIcon className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>
      <div className="flex justify-between items-center px-1">
        <SunIcon className="w-3 h-3 text-yellow-500" />
        <MoonIcon className="w-3 h-3 text-dark-400" />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
