// client/src/components/common/Logo.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <svg
          viewBox="0 0 50 50"
          className={`${
            size === "sm"
              ? "w-8 h-8"
              : size === "lg"
              ? "w-12 h-12"
              : "w-10 h-10"
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle cx="25" cy="25" r="23" className="fill-primary-600" />
          {/* Graduation cap */}
          <path d="M25 12L8 20L25 28L42 20L25 12Z" className="fill-white" />
          <path
            d="M15 23V32C15 32 20 36 25 36C30 36 35 32 35 32V23L25 28L15 23Z"
            className="fill-white/90"
          />
          {/* Tassel */}
          <path
            d="M40 20V30"
            className="stroke-white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="40" cy="32" r="2" className="fill-primary-300" />
          {/* Question mark overlay */}
          <text
            x="25"
            y="42"
            className="fill-primary-300"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            ?
          </text>
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#faf5ff]0 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
      </motion.div>
      <div className={`font-bold ${sizes[size]}`}>
        <span className="text-[#faf5ff]0">Campus</span>
        <span className="text-dark-800 dark:text-white">Connect</span>
      </div>
    </Link>
  );
};

export default Logo;
