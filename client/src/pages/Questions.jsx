// client/src/pages/Questions.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import QuestionList from "../components/questions/QuestionList";
import Button from "../components/common/Button";
import { questionService } from "../services/questionService";
import { useAuth } from "../hooks/useAuth";

const Questions = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const currentSort = searchParams.get("sort") || "newest";
  const currentTag = searchParams.get("tag") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "votes", label: "Most Votes" },
    { value: "unanswered", label: "Unanswered" },
    { value: "oldest", label: "Oldest" },
  ];

  useEffect(() => {
    fetchQuestions();
  }, [currentSort, currentTag, currentSearch, currentPage]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionService.getAll({
        page: currentPage,
        sort: currentSort,
        tag: currentTag,
        search: currentSearch,
        limit: 10,
      });
      setQuestions(response.data.questions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sort) => {
    searchParams.set("sort", sort);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handlePageChange = (page) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
              {currentTag
                ? `Questions tagged [${currentTag}]`
                : currentSearch
                ? `Search results for "${currentSearch}"`
                : "All Questions"}
            </h1>
            <p className="mt-1 text-dark-600 dark:text-dark-400">
              {pagination.total} questions
            </p>
          </div>
          {user && (
            <Link to="/ask">
              <Button>Ask Question</Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-dark-400" />
            <span className="text-sm text-dark-600 dark:text-dark-400">
              Sort by:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentSort === option.value
                    ? "bg-primary-600 text-white"
                    : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {(currentTag || currentSearch) && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Active Filters */}
        {(currentTag || currentSearch) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentTag && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-[#581c87]/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Tag: {currentTag}
                <button
                  onClick={() => {
                    searchParams.delete("tag");
                    setSearchParams(searchParams);
                  }}
                  className="ml-1 hover:text-[#581c87]"
                >
                  ×
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-[#581c87]/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                <MagnifyingGlassIcon className="w-4 h-4" />
                {currentSearch}
                <button
                  onClick={() => {
                    searchParams.delete("search");
                    setSearchParams(searchParams);
                  }}
                  className="ml-1 hover:text-[#581c87]"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Questions List */}
        <QuestionList
          questions={questions}
          loading={loading}
          emptyMessage={
            currentSearch
              ? "No questions match your search"
              : currentTag
              ? "No questions with this tag yet"
              : "No questions yet. Be the first to ask!"
          }
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="secondary"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.currentPage - 1 &&
                    page <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === pagination.currentPage
                          ? "bg-primary-600 text-white"
                          : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.currentPage - 2 ||
                  page === pagination.currentPage + 2
                ) {
                  return (
                    <span key={page} className="text-dark-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <Button
              variant="secondary"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Questions;
