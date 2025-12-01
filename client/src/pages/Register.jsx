// client/src/pages/Register.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/common/Logo";
import RegisterForm from "../components/auth/RegisterForm";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
              Join Campus Connect
            </h1>
            <p className="mt-2 text-dark-600 dark:text-dark-400">
              Create your account and start connecting
            </p>
          </div>
          <RegisterForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
