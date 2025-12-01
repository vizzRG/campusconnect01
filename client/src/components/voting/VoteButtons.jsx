// client/src/components/voting/VoteButtons.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const VoteButtons = ({
  voteScore,
  upvotes = [],
  downvotes = [],
  onVote,
  isAccepted,
  onAccept,
  canAccept,
  vertical = true,
}) => {
  const { user } = useAuth();

  const hasUpvoted = user && upvotes.includes(user._id);
  const hasDownvoted = user && downvotes.includes(user._id);

  const handleVote = (type) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }
    onVote(type);
  };

  return (
    <div
      className={`flex ${
        vertical ? "flex-col" : "flex-row"
      } items-center gap-1`}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote("up")}
        className={`p-2 rounded-lg transition-colors ${
          hasUpvoted
            ? "bg-primary-100 dark:bg-[#581c87]/30 text-primary-600"
            : "hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-400"
        }`}
      >
        <ChevronUpIcon className="w-6 h-6" />
      </motion.button>

      <motion.span
        key={voteScore}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className={`text-lg font-bold ${
          voteScore > 0
            ? "text-green-600"
            : voteScore < 0
            ? "text-red-500"
            : "text-dark-500"
        }`}
      >
        {voteScore}
      </motion.span>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote("down")}
        className={`p-2 rounded-lg transition-colors ${
          hasDownvoted
            ? "bg-red-100 dark:bg-red-900/30 text-red-500"
            : "hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-400"
        }`}
      >
        <ChevronDownIcon className="w-6 h-6" />
      </motion.button>

      {(isAccepted || canAccept) && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAccept}
          disabled={!canAccept && !isAccepted}
          className={`p-2 rounded-lg transition-colors mt-2 ${
            isAccepted
              ? "text-green-500"
              : canAccept
              ? "text-dark-400 hover:text-green-500"
              : "text-dark-300 cursor-default"
          }`}
          title={
            isAccepted
              ? "Accepted answer"
              : canAccept
              ? "Accept this answer"
              : ""
          }
        >
          <CheckCircleIcon className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default VoteButtons;
