// client/src/components/common/Loader.jsx
import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const Spinner = () => (
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} border-4 border-primary-200 dark:border-[#581c87] border-t-primary-600 rounded-full`}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className={`w-2 h-2 bg-primary-600 rounded-full`} />
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Spinner />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-4 text-dark-600 dark:text-dark-400"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return <Spinner />;
};

export default Loader;
