// client/src/components/common/Button.jsx
import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-[#faf5ff]0/25",
    secondary:
      "bg-dark-200 dark:bg-dark-700 hover:bg-dark-300 dark:hover:bg-dark-600 text-dark-800 dark:text-dark-200",
    ghost:
      "hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-600 dark:text-dark-400",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25",
    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25",
    outline:
      "border-2 border-[#faf5ff]0 text-primary-600 dark:text-primary-400 hover:bg-[#faf5ff] dark:hover:bg-[#581c87]/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
