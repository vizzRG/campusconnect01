// client/src/pages/Tags.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Loader from "../components/common/Loader";
import { questionService } from "../services/questionService";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await questionService.getTags();
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag._id.toLowerCase().includes(search.toLowerCase())
  );

  const getTagDescription = (tag) => {
    const descriptions = {
      academics: "Questions about courses, exams, and studies",
      hostel: "Hostel life, accommodation, and facilities",
      placement: "Campus placements and job opportunities",
      clubs: "Student clubs and extracurricular activities",
      events: "College events, fests, and celebrations",
      library: "Library resources and study spaces",
      canteen: "Food, canteen, and mess facilities",
      sports: "Sports facilities and competitions",
      exams: "Examination schedules and preparation",
      attendance: "Attendance policies and requirements",
      projects: "Academic projects and assignments",
      internship: "Internship opportunities and experiences",
      seniors: "Guidance from senior students",
      freshers: "Tips for first-year students",
      "college-life": "General college life experiences",
    };
    return descriptions[tag] || `Questions tagged with ${tag}`;
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
            Tags
          </h1>
          <p className="mt-1 text-dark-600 dark:text-dark-400">
            Browse questions by topic
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by tag name..."
            className="input-field pl-10"
          />
        </div>

        {/* Tags Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTags.map((tag, index) => (
              <motion.div
                key={tag._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/questions?tag=${tag._id}`}
                  className="card card-hover block h-full"
                >
                  <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-[#581c87]/30 text-primary-700 dark:text-primary-300 rounded-md text-sm font-medium mb-3">
                    {tag._id}
                  </div>
                  <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
                    {getTagDescription(tag._id)}
                  </p>
                  <p className="text-xs text-dark-500">
                    {tag.count} {tag.count === 1 ? "question" : "questions"}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredTags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-500">No tags found matching "{search}"</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Tags;
