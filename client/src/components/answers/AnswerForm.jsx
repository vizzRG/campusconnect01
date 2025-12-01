// client/src/components/answers/AnswerForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { Link } from "react-router-dom";

const AnswerForm = ({ onSubmit, loading }) => {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("Please write your answer");
      return;
    }
    if (body.length < 30) {
      setError("Your answer must be at least 30 characters");
      return;
    }
    setError("");
    onSubmit(body);
    setBody("");
  };

  if (!user) {
    return (
      <div className="card text-center py-8">
        <p className="text-dark-600 dark:text-dark-400 mb-4">
          You need to be logged in to answer questions.
        </p>
        <Link to="/login">
          <Button>Log in to Answer</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card"
    >
      <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
      <textarea
        rows={8}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your answer here. Be detailed and helpful. Markdown is supported."
        className={`input-field resize-y ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-dark-500">
          Markdown formatting is supported
        </p>
        <Button type="submit" loading={loading}>
          Post Your Answer
        </Button>
      </div>
    </motion.form>
  );
};

export default AnswerForm;
