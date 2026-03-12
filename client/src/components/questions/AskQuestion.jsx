// // client/src/components/questions/AskQuestion.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import Input from "../common/Input";
// import Button from "../common/Button";
// import TagInput from "./TagInput";
// import { questionService } from "../../services/questionService";

// const AskQuestion = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     body: "",
//     tags: [],
//   });
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) {
//       newErrors.title = "Title is required";
//     } else if (formData.title.length < 15) {
//       newErrors.title = "Title must be at least 15 characters";
//     }
//     if (!formData.body.trim()) {
//       newErrors.body = "Question body is required";
//     } else if (formData.body.length < 30) {
//       newErrors.body = "Please provide more details (at least 30 characters)";
//     }
//     if (formData.tags.length === 0) {
//       newErrors.tags = "Please add at least one tag";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setLoading(true);
//     try {
//       const response = await questionService.create(formData);
//       toast.success("Question posted successfully!");
//       navigate(`/questions/${response.data._id}`);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to post question");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-3xl mx-auto"
//     >
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-100">
//           Ask a Question
//         </h1>
//         <p className="mt-2 text-dark-600 dark:text-dark-400">
//           Get help from your campus community. Be specific and include all
//           relevant details.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Title */}
//         <div className="card">
//           <h2 className="text-lg font-semibold mb-2">Title</h2>
//           <p className="text-sm text-dark-500 mb-4">
//             Be specific and imagine you're asking a question to another student.
//           </p>
//           <Input
//             placeholder="e.g., How do I apply for hostel accommodation as a first-year student?"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//             error={errors.title}
//           />
//         </div>

//         {/* Body */}
//         <div className="card">
//           <h2 className="text-lg font-semibold mb-2">Details</h2>
//           <p className="text-sm text-dark-500 mb-4">
//             Include all the information someone would need to answer your
//             question. Markdown is supported.
//           </p>
//           <textarea
//             rows={10}
//             placeholder="Describe your question in detail..."
//             value={formData.body}
//             onChange={(e) => setFormData({ ...formData, body: e.target.value })}
//             className={`input-field resize-y ${
//               errors.body ? "border-red-500" : ""
//             }`}
//           />
//           {errors.body && (
//             <p className="mt-1 text-sm text-red-500">{errors.body}</p>
//           )}
//         </div>

//         {/* Tags */}
//         <div className="card">
//           <h2 className="text-lg font-semibold mb-2">Tags</h2>
//           <p className="text-sm text-dark-500 mb-4">
//             Add tags to describe what your question is about.
//           </p>
//           <TagInput
//             tags={formData.tags}
//             setTags={(tags) => setFormData({ ...formData, tags })}
//           />
//           {errors.tags && (
//             <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
//           )}
//         </div>

//         {/* Submit */}
//         <div className="flex items-center gap-4">
//           <Button type="submit" loading={loading} size="lg">
//             Post Your Question
//           </Button>
//           <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
//             Cancel
//           </Button>
//         </div>
//       </form>

//       {/* Tips */}
//       <div className="mt-8 card bg-[#faf5ff] dark:bg-[#581c87]/20 border-primary-200 dark:border-primary-800">
//         <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">
//           Tips for getting good answers:
//         </h3>
//         <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
//           <li>✓ Search to see if your question has been asked before</li>
//           <li>✓ Be clear and specific about your problem</li>
//           <li>✓ Include relevant details like your year, branch, or college</li>
//           <li>✓ Use proper formatting to make your question easy to read</li>
//           <li>✓ Proofread your question before posting</li>
//         </ul>
//       </div>
//     </motion.div>
//   );
// };

// export default AskQuestion;

// client/src/components/questions/AskQuestion.jsx (Updated with AI Integration)
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  SparklesIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  LightBulbIcon,
  TagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Input from "../common/Input";
import Button from "../common/Button";
import TagInput from "./TagInput";
import { questionService } from "../../services/questionService";
import { aiService } from "../../services/aiService";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTagsLoading, setAiTagsLoading] = useState(false);
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);
  const [enhancedData, setEnhancedData] = useState(null);

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

  const handleEnhanceWithAI = async () => {
    if (!formData.title.trim() && !formData.body.trim()) {
      toast.error("Please write something to enhance");
      return;
    }

    setAiLoading(true);
    try {
      const result = await aiService.enhanceQuestion({
        title: formData.title,
        body: formData.body,
        tags: formData.tags,
      });

      if (result.success && result.enhanced) {
        setEnhancedData(result.enhanced);
        setShowEnhancedPreview(true);
        toast.success("Question enhanced! Review the changes below.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enhance with AI");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptEnhancement = () => {
    if (enhancedData) {
      setFormData((prev) => ({
        ...prev,
        title: enhancedData.title || prev.title,
        body: enhancedData.body || prev.body,
      }));
      setShowEnhancedPreview(false);
      setEnhancedData(null);
      toast.success("Enhanced version applied!");
    }
  };

  const handleRejectEnhancement = () => {
    setShowEnhancedPreview(false);
    setEnhancedData(null);
  };

  const handleGenerateTags = async () => {
    if (!formData.title.trim() && !formData.body.trim()) {
      toast.error("Please write a title or description first");
      return;
    }

    setAiTagsLoading(true);
    try {
      const result = await aiService.generateTags({
        title: formData.title,
        body: formData.body,
      });

      if (result.success && result.tags) {
        // Merge with existing tags, avoiding duplicates
        const newTags = [...new Set([...formData.tags, ...result.tags])].slice(
          0,
          5,
        );
        setFormData((prev) => ({ ...prev, tags: newTags }));
        toast.success("Tags generated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate tags");
    } finally {
      setAiTagsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
          Ask a Question
        </h1>
        <p className="mt-2 text-dark-600 dark:text-dark-400">
          Get help from your campus community. Be specific and include all
          relevant details.
        </p>
      </div>

      {/* AI Enhancement Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 dark:from-primary-900/30 dark:to-purple-900/30 rounded-xl border border-primary-200 dark:border-primary-800"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-500 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-dark-800 dark:text-dark-200">
              ✨ AI-Powered Enhancement
            </h3>
            <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
              Write your question naturally, then use AI to make it more
              professional and clear. Get better answers with well-structured
              questions!
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Title</h2>
          </div>
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
          <div className="mt-2 text-xs text-dark-400">
            {formData.title.length}/150 characters
          </div>
        </div>

        {/* Body */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Details</h2>
          </div>
          <p className="text-sm text-dark-500 mb-4">
            Include all the information someone would need to answer your
            question. Markdown is supported.
          </p>
          <textarea
            rows={10}
            placeholder="Describe your question in detail...

For example:
- What specific problem are you facing?
- What have you already tried?
- Any relevant details about your college/year/branch?"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            className={`input-field resize-y ${errors.body ? "border-red-500" : ""}`}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-500">{errors.body}</p>
          )}
          <div className="mt-2 text-xs text-dark-400">
            {formData.body.length} characters (minimum 30)
          </div>
        </div>

        {/* AI Enhancement Button */}
        <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-dark-800 dark:text-dark-200 flex items-center justify-center sm:justify-start gap-2">
                <SparklesIcon className="w-5 h-5 text-primary-500" />
                Enhance with AI
              </h3>
              <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                Let AI improve your question's clarity and professionalism
              </p>
            </div>
            <Button
              type="button"
              onClick={handleEnhanceWithAI}
              loading={aiLoading}
              disabled={
                aiLoading || (!formData.title.trim() && !formData.body.trim())
              }
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 whitespace-nowrap"
            >
              {aiLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Enhance with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Preview */}
        <AnimatePresence>
          {showEnhancedPreview && enhancedData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="card border-2 border-primary-500 dark:border-primary-400 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-primary-500 rounded-lg">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-primary-600 dark:text-primary-400">
                  AI Enhanced Version
                </h3>
                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                  Preview
                </span>
              </div>

              {/* Enhanced Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1">
                  Enhanced Title
                </label>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-dark-800 dark:text-dark-200">
                    {enhancedData.title}
                  </p>
                </div>
                {formData.title !== enhancedData.title && (
                  <div className="mt-2 p-2 bg-dark-100 dark:bg-dark-800 rounded text-sm">
                    <span className="text-dark-500">Original: </span>
                    <span className="text-dark-400 line-through">
                      {formData.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Body */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1">
                  Enhanced Description
                </label>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-dark-800 dark:text-dark-200 font-sans text-sm">
                    {enhancedData.body}
                  </pre>
                </div>
              </div>

              {/* Accept/Reject Buttons */}
              <div className="flex gap-3 pt-4 border-t border-dark-200 dark:border-dark-700">
                <Button
                  type="button"
                  onClick={handleAcceptEnhancement}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckIcon className="w-5 h-5" />
                  Accept Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRejectEnhancement}
                  className="flex-1"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Keep Original
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Tags</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateTags}
              loading={aiTagsLoading}
              disabled={
                aiTagsLoading ||
                (!formData.title.trim() && !formData.body.trim())
              }
              className="text-primary-600 hover:text-primary-700"
            >
              {aiTagsLoading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <TagIcon className="w-4 h-4" />
                  Auto-generate Tags
                </>
              )}
            </Button>
          </div>
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
            <DocumentTextIcon className="w-5 h-5" />
            Post Your Question
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <LightBulbIcon className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-3">
              Tips for getting good answers:
            </h3>
            <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Search to see if your question has been asked before
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Be clear and specific about your problem</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Include relevant details like your year, branch, or college
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Use the AI enhancement to polish your question professionally
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Proofread your question before posting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI Features Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700 text-center"
        >
          <SparklesIcon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <h4 className="font-medium text-dark-800 dark:text-dark-200">
            Enhance Question
          </h4>
          <p className="text-xs text-dark-500 mt-1">
            AI improves clarity & professionalism
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700 text-center"
        >
          <TagIcon className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <h4 className="font-medium text-dark-800 dark:text-dark-200">
            Auto Tags
          </h4>
          <p className="text-xs text-dark-500 mt-1">
            AI suggests relevant tags
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-700 text-center"
        >
          <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <h4 className="font-medium text-dark-800 dark:text-dark-200">
            Better Format
          </h4>
          <p className="text-xs text-dark-500 mt-1">
            Markdown formatting support
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AskQuestion;
