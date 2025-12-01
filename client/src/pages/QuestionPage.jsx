// client/src/pages/QuestionPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import QuestionDetail from "../components/questions/QuestionDetail";
import AnswerList from "../components/answers/AnswerList";
import AnswerForm from "../components/answers/AnswerForm";
import Loader from "../components/common/Loader";
import { questionService } from "../services/questionService";
import { answerService } from "../services/answerService";
import { useAuth } from "../hooks/useAuth";

const QuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await questionService.getOne(id);
      setQuestion(response.data);
    } catch (error) {
      toast.error("Question not found");
      navigate("/questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    setAnswerLoading(true);
    try {
      const response = await answerService.getByQuestion(id);
      setAnswers(response.data);
    } catch (error) {
      console.error("Failed to fetch answers:", error);
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleQuestionVote = async (type) => {
    try {
      const response = await questionService.vote(id, type);
      setQuestion((prev) => ({
        ...prev,
        upvotes:
          type === "up"
            ? prev.upvotes.includes(user._id)
              ? prev.upvotes.filter((id) => id !== user._id)
              : [...prev.upvotes, user._id]
            : prev.upvotes.filter((id) => id !== user._id),
        downvotes:
          type === "down"
            ? prev.downvotes.includes(user._id)
              ? prev.downvotes.filter((id) => id !== user._id)
              : [...prev.downvotes, user._id]
            : prev.downvotes.filter((id) => id !== user._id),
        voteScore: response.data.voteScore,
      }));
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const handleQuestionDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      await questionService.delete(id);
      toast.success("Question deleted");
      navigate("/questions");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const handleAnswerSubmit = async (body) => {
    setSubmittingAnswer(true);
    try {
      const response = await answerService.create(id, { body });
      setAnswers((prev) => [...prev, response.data]);
      setQuestion((prev) => ({ ...prev, answerCount: prev.answerCount + 1 }));
      toast.success("Answer posted!");
    } catch (error) {
      toast.error("Failed to post answer");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAnswerUpdate = (updatedAnswer) => {
    setAnswers((prev) =>
      prev.map((a) => (a._id === updatedAnswer._id ? updatedAnswer : a))
    );
  };

  const handleAnswerDelete = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      await answerService.delete(answerId);
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
      setQuestion((prev) => ({ ...prev, answerCount: prev.answerCount - 1 }));
      toast.success("Answer deleted");
    } catch (error) {
      toast.error("Failed to delete answer");
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!question) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Question */}
        <QuestionDetail
          question={question}
          onVote={handleQuestionVote}
          onDelete={handleQuestionDelete}
        />

        {/* Answers Section */}
        <div>
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>
          <AnswerList
            answers={answers}
            loading={answerLoading}
            questionAuthorId={question.author?._id}
            onUpdate={handleAnswerUpdate}
            onDelete={handleAnswerDelete}
          />
        </div>

        {/* Answer Form */}
        <AnswerForm onSubmit={handleAnswerSubmit} loading={submittingAnswer} />
      </motion.div>
    </div>
  );
};

export default QuestionPage;
