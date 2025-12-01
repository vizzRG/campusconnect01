// client/src/pages/Users.jsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "../components/common/Avatar";
import Loader from "../components/common/Loader";
import { userService } from "../services/userService";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const currentSort = searchParams.get("sort") || "reputation";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const sortOptions = [
    { value: "reputation", label: "Reputation" },
    { value: "newest", label: "New Users" },
    { value: "name", label: "Name" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentSort, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll({
        page: currentPage,
        sort: currentSort,
        limit: 20,
      });
      setUsers(response.data.users);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sort) => {
    searchParams.set("sort", sort);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
            Users
          </h1>
          <p className="mt-1 text-dark-600 dark:text-dark-400">
            {pagination.total} members in our community
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentSort === option.value
                  ? "bg-primary-600 text-white"
                  : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/profile/${user._id}`}
                  className="card card-hover flex items-center gap-4"
                >
                  <Avatar src={user.avatar} name={user.username} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark-800 dark:text-dark-200 truncate">
                      {user.username}
                    </h3>
                    {user.college && (
                      <p className="text-sm text-dark-500 truncate">
                        {user.college}
                      </p>
                    )}
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {user.reputation} reputation
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  searchParams.set("page", (i + 1).toString());
                  setSearchParams(searchParams);
                }}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  i + 1 === pagination.currentPage
                    ? "bg-primary-600 text-white"
                    : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Users;
