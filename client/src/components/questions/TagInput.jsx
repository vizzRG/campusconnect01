// client/src/components/questions/TagInput.jsx
import React, { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const TagInput = ({ tags, setTags, maxTags = 5 }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const suggestedTags = [
    "academics",
    "hostel",
    "placement",
    "clubs",
    "events",
    "library",
    "canteen",
    "sports",
    "exams",
    "attendance",
    "projects",
    "internship",
    "seniors",
    "freshers",
    "college-life",
  ];

  const filteredSuggestions = suggestedTags.filter(
    (tag) => tag.includes(input.toLowerCase()) && !tags.includes(tag)
  );

  const addTag = (tag) => {
    const formattedTag = tag.toLowerCase().trim().replace(/\s+/g, "-");
    if (formattedTag && !tags.includes(formattedTag) && tags.length < maxTags) {
      setTags([...tags, formattedTag]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap gap-2 p-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus-within:ring-2 focus-within:ring-[#faf5ff]0 cursor-text"
      >
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-[#581c87]/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="hover:text-[#581c87] dark:hover:text-primary-100"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length < maxTags ? "Add tags..." : ""}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-dark-800 dark:text-dark-200 placeholder-dark-400"
        />
      </div>

      {input && filteredSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filteredSuggestions.slice(0, 6).map((tag) => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="px-3 py-1 bg-dark-100 dark:bg-dark-700 hover:bg-primary-100 dark:hover:bg-[#581c87]/30 text-dark-600 dark:text-dark-300 hover:text-primary-700 dark:hover:text-primary-300 rounded-full text-sm transition-colors"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      )}

      <p className="text-xs text-dark-500">
        Add up to {maxTags} tags. Press Enter or comma to add.
      </p>
    </div>
  );
};

export default TagInput;
