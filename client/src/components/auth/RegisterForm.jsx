// client/src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    year: "",
    branch: "",
  });
  const [errors, setErrors] = useState({});

  const yearOptions = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Alumni",
    "Faculty",
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        year: formData.year,
        branch: formData.branch,
      });
      toast.success("Welcome to Campus Connect!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Username"
        icon={UserIcon}
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Choose a username"
        error={errors.username}
        required
      />

      <Input
        label="Email"
        type="email"
        icon={EnvelopeIcon}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Enter your email"
        error={errors.email}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          icon={LockClosedIcon}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Create a password"
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          icon={LockClosedIcon}
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Confirm password"
          error={errors.confirmPassword}
          required
        />
      </div>

      <Input
        label="College/University"
        icon={AcademicCapIcon}
        value={formData.college}
        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
        placeholder="Enter your college name"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
            Year
          </label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="input-field"
          >
            <option value="">Select year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Branch/Major"
          value={formData.branch}
          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          placeholder="e.g., Computer Science"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="w-4 h-4 mt-1 text-primary-600 border-dark-300 rounded focus:ring-[#faf5ff]0"
        />
        <label
          htmlFor="terms"
          className="text-sm text-dark-600 dark:text-dark-400"
        >
          I agree to the{" "}
          <Link to="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Account
      </Button>

      <p className="text-center text-sm text-dark-600 dark:text-dark-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Log in
        </Link>
      </p>
    </motion.form>
  );
};

export default RegisterForm;
