// client/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-9xl mb-8"
        >
          🤔
        </motion.div>
        <h1 className="text-6xl font-bold text-dark-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-dark-700 dark:text-dark-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-dark-600 dark:text-dark-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link to="/questions">
            <Button variant="secondary" size="lg">
              Browse Questions
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
