// client/src/components/common/Modal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizes[size]} bg-white dark:bg-dark-900 rounded-2xl shadow-2xl z-50 overflow-hidden`}
          >
            <div className="flex items-center justify-between p-4 border-b border-dark-100 dark:border-dark-800">
              <h2 className="text-xl font-semibold text-dark-800 dark:text-dark-200">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
