// client/src/components/questions/QuestionDetail.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  PencilIcon,
  TrashIcon,
  BookmarkIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import VoteButtons from "../voting/VoteButtons";
import { formatRelativeDate, formatFullDate } from "../../utils/formatDate";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const QuestionDetail = ({ question, onVote, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user && user._id === question.author?._id;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex gap-4">
        {/* Vote Buttons */}
        <div className="hidden sm:block">
          <VoteButtons
            voteScore={question.voteScore}
            upvotes={question.upvotes}
            downvotes={question.downvotes}
            onVote={onVote}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-100">
            {question.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-dark-500">
            <span>Asked {formatRelativeDate(question.createdAt)}</span>
            <span>Viewed {question.views} times</span>
            {question.updatedAt !== question.createdAt && (
              <span>Modified {formatRelativeDate(question.updatedAt)}</span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {question.tags?.map((tag) => (
              <Link
                key={tag}
                to={`/questions?tag=${tag}`}
                className="px-3 py-1 bg-primary-100 dark:bg-[#581c87]/30 text-primary-700 dark:text-primary-300 rounded-md text-sm font-medium hover:bg-primary-200 dark:hover:bg-[#581c87]/50 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Body */}
          <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{question.body}</ReactMarkdown>
          </div>

          {/* Mobile Vote */}
          <div className="sm:hidden mt-4">
            <VoteButtons
              voteScore={question.voteScore}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              onVote={onVote}
              vertical={false}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-dark-100 dark:border-dark-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-sm text-dark-500 hover:text-primary-600 transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-1 text-sm text-dark-500 hover:text-primary-600 transition-colors">
                <BookmarkIcon className="w-4 h-4" />
                Save
              </button>
              {isAuthor && (
                <>
                  <Link
                    to={`/questions/${question._id}/edit`}
                    className="flex items-center gap-1 text-sm text-dark-500 hover:text-primary-600 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Author Card */}
            <div className="bg-[#faf5ff] dark:bg-[#581c87]/20 rounded-lg p-3">
              <div className="text-xs text-dark-500 mb-2">
                asked {formatFullDate(question.createdAt)}
              </div>
              <Link
                to={`/profile/${question.author?._id}`}
                className="flex items-center gap-2"
              >
                <Avatar
                  src={question.author?.avatar}
                  name={question.author?.username}
                  size="md"
                />
                <div>
                  <div className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
                    {question.author?.username}
                  </div>
                  <div className="text-xs text-dark-500">
                    {question.author?.reputation} reputation
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionDetail;
