// client/src/components/answers/AnswerCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../common/Avatar.jsx";
import VoteButtons from "../voting/VoteButtons.jsx";
import Button from "../common/Button.jsx";
import { formatRelativeDate, formatFullDate } from "../../utils/formatDate.js";
import { useAuth } from "../../hooks/useAuth.js";
import { answerService } from "../../services/answerService.js";
import toast from "react-hot-toast";

const AnswerCard = ({ answer, questionAuthorId, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(answer.body);

  const isAuthor = user && user._id === answer.author?._id;
  const isQuestionAuthor = user && user._id === questionAuthorId;

  const handleVote = async (type) => {
    try {
      const response = await answerService.vote(answer._id, type);
      onUpdate({ ...answer, ...response.data });
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const handleAccept = async () => {
    try {
      await answerService.accept(answer._id);
      onUpdate({ ...answer, isAccepted: true });
      toast.success("Answer accepted!");
    } catch (error) {
      toast.error("Failed to accept answer");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await answerService.addComment(answer._id, comment);
      onUpdate(response.data);
      setComment("");
      setShowCommentForm(false);
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleEdit = async () => {
    try {
      const response = await answerService.update(answer._id, {
        body: editBody,
      });
      onUpdate(response.data);
      setIsEditing(false);
      toast.success("Answer updated!");
    } catch (error) {
      toast.error("Failed to update answer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${
        answer.isAccepted
          ? "border-green-500 bg-green-50/50 dark:bg-green-900/10"
          : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Vote Buttons */}
        <div className="hidden sm:block">
          <VoteButtons
            voteScore={answer.voteScore}
            upvotes={answer.upvotes}
            downvotes={answer.downvotes}
            onVote={handleVote}
            isAccepted={answer.isAccepted}
            canAccept={isQuestionAuthor && !answer.isAccepted}
            onAccept={handleAccept}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {answer.isAccepted && (
            <div className="mb-4 text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Accepted Answer
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <textarea
                rows={6}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="input-field resize-y"
              />
              <div className="flex gap-2">
                <Button onClick={handleEdit} size="sm">
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{answer.body}</ReactMarkdown>
            </div>
          )}

          {/* Mobile Vote */}
          <div className="sm:hidden mt-4">
            <VoteButtons
              voteScore={answer.voteScore}
              upvotes={answer.upvotes}
              downvotes={answer.downvotes}
              onVote={handleVote}
              isAccepted={answer.isAccepted}
              canAccept={isQuestionAuthor && !answer.isAccepted}
              onAccept={handleAccept}
              vertical={false}
            />
          </div>

          {/* Actions & Author */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-dark-100 dark:border-dark-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="flex items-center gap-1 text-sm text-dark-500 hover:text-primary-600 transition-colors"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Add comment
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-sm text-dark-500 hover:text-primary-600 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(answer._id)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Author Card */}
            <div className="bg-dark-50 dark:bg-dark-800 rounded-lg p-3">
              <div className="text-xs text-dark-500 mb-2">
                answered {formatFullDate(answer.createdAt)}
              </div>
              <Link
                to={`/profile/${answer.author?._id}`}
                className="flex items-center gap-2"
              >
                <Avatar
                  src={answer.author?.avatar}
                  name={answer.author?.username}
                  size="sm"
                />
                <div>
                  <div className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    {answer.author?.username}
                  </div>
                  <div className="text-xs text-dark-500">
                    {answer.author?.reputation} reputation
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Comments */}
          {answer.comments && answer.comments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-800 space-y-3">
              {answer.comments.map((c, index) => (
                <div key={index} className="flex gap-2 text-sm">
                  <span className="text-dark-600 dark:text-dark-400">
                    {c.body}
                  </span>
                  <span className="text-dark-400">–</span>
                  <Link
                    to={`/profile/${c.author?._id}`}
                    className="text-primary-600 dark:text-primary-400"
                  >
                    {c.author?.username}
                  </Link>
                  <span className="text-dark-400">
                    {formatRelativeDate(c.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          {showCommentForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleAddComment}
              className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-800"
            >
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="input-field text-sm resize-none"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Add Comment
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnswerCard;
