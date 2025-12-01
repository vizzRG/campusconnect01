// client/src/pages/AskQuestionPage.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import AskQuestion from "../components/questions/AskQuestion";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const AskQuestionPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AskQuestion />
    </div>
  );
};

export default AskQuestionPage;
