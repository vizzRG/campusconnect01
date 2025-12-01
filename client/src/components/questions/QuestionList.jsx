// client/src/components/questions/QuestionList.jsx
import React from "react";
import QuestionCard from "./QuestionCard";
import Loader from "../common/Loader";
import { motion } from "framer-motion";

const QuestionList = ({
  questions,
  loading,
  emptyMessage = "No questions found",
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-dark-500 dark:text-dark-400">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <QuestionCard key={question._id} question={question} index={index} />
      ))}
    </div>
  );
};

export default QuestionList;
