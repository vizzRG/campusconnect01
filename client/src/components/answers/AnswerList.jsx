// client/src/components/answers/AnswerList.jsx
import React from "react";
import AnswerCard from "./AnswerCard.jsx";
import Loader from "../common/Loader.jsx";

const AnswerList = ({
  answers,
  loading,
  questionAuthorId,
  onUpdate,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (!answers || answers.length === 0) {
    return (
      <div className="text-center py-8 text-dark-500">
        No answers yet. Be the first to answer!
      </div>
    );
  }

  // Sort: accepted first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.voteScore - a.voteScore;
  });

  return (
    <div className="space-y-4">
      {sortedAnswers.map((answer) => (
        <AnswerCard
          key={answer._id}
          answer={answer}
          questionAuthorId={questionAuthorId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AnswerList;
