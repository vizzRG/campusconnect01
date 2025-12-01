// client/src/components/questions/AskQuestion.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import TagInput from "./TagInput";
import { questionService } from "../../services/questionService";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 15) {
      newErrors.title = "Title must be at least 15 characters";
    }
    if (!formData.body.trim()) {
      newErrors.body = "Question body is required";
    } else if (formData.body.length < 30) {
      newErrors.body = "Please provide more details (at least 30 characters)";
    }
    if (formData.tags.length === 0) {
      newErrors.tags = "Please add at least one tag";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await questionService.create(formData);
      toast.success("Question posted successfully!");
      navigate(`/questions/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-100">
          Ask a Question
        </h1>
        <p className="mt-2 text-dark-600 dark:text-dark-400">
          Get help from your campus community. Be specific and include all
          relevant details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Title</h2>
          <p className="text-sm text-dark-500 mb-4">
            Be specific and imagine you're asking a question to another student.
          </p>
          <Input
            placeholder="e.g., How do I apply for hostel accommodation as a first-year student?"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            error={errors.title}
          />
        </div>

        {/* Body */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Details</h2>
          <p className="text-sm text-dark-500 mb-4">
            Include all the information someone would need to answer your
            question. Markdown is supported.
          </p>
          <textarea
            rows={10}
            placeholder="Describe your question in detail..."
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className={`input-field resize-y ${
              errors.body ? "border-red-500" : ""
            }`}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-500">{errors.body}</p>
          )}
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Tags</h2>
          <p className="text-sm text-dark-500 mb-4">
            Add tags to describe what your question is about.
          </p>
          <TagInput
            tags={formData.tags}
            setTags={(tags) => setFormData({ ...formData, tags })}
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" loading={loading} size="lg">
            Post Your Question
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 card bg-[#faf5ff] dark:bg-[#581c87]/20 border-primary-200 dark:border-primary-800">
        <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">
          Tips for getting good answers:
        </h3>
        <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
          <li>✓ Search to see if your question has been asked before</li>
          <li>✓ Be clear and specific about your problem</li>
          <li>✓ Include relevant details like your year, branch, or college</li>
          <li>✓ Use proper formatting to make your question easy to read</li>
          <li>✓ Proofread your question before posting</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AskQuestion;
