// client/src/components/questions/QuestionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar";
import { formatRelativeDate } from "../../utils/formatDate";

const QuestionCard = ({ question, index = 0 }) => {
  const {
    _id,
    title,
    body,
    tags,
    author,
    upvotes,
    downvotes,
    answerCount,
    views,
    isAccepted,
    createdAt,
  } = question;

  const voteScore = (upvotes?.length || 0) - (downvotes?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card card-hover"
    >
      <div className="flex gap-4">
        {/* Stats */}
        <div className="hidden sm:flex flex-col items-center gap-2 text-center min-w-[80px]">
          <div
            className={`px-3 py-2 rounded-lg ${
              voteScore > 0
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400"
            }`}
          >
            <div className="text-lg font-bold">{voteScore}</div>
            <div className="text-xs">votes</div>
          </div>
          <div
            className={`px-3 py-2 rounded-lg ${
              isAccepted
                ? "bg-green-500 text-white"
                : answerCount > 0
                ? "border-2 border-green-500 text-green-600 dark:text-green-400"
                : "bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400"
            }`}
          >
            <div className="text-lg font-bold flex items-center gap-1">
              {isAccepted && <CheckCircleIcon className="w-4 h-4" />}
              {answerCount}
            </div>
            <div className="text-xs">answers</div>
          </div>
          <div className="text-dark-500 text-sm">{views} views</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/questions/${_id}`}>
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="mt-2 text-dark-600 dark:text-dark-400 text-sm line-clamp-2">
            {body.replace(/[#*`]/g, "").substring(0, 200)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags?.map((tag) => (
              <Link
                key={tag}
                to={`/questions?tag=${tag}`}
                className="px-2.5 py-1 bg-primary-100 dark:bg-[#581c87]/30 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium hover:bg-primary-200 dark:hover:bg-[#581c87]/50 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Mobile Stats & Author */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex sm:hidden items-center gap-4 text-sm text-dark-500">
              <span className="flex items-center gap-1">
                <span className={voteScore > 0 ? "text-green-600" : ""}>
                  {voteScore}
                </span>{" "}
                votes
              </span>
              <span className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                {answerCount}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                {views}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Avatar src={author?.avatar} name={author?.username} size="xs" />
              <Link
                to={`/profile/${author?._id}`}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {author?.username}
              </Link>
              <span className="text-dark-400">•</span>
              <span className="text-dark-500">
                {formatRelativeDate(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
