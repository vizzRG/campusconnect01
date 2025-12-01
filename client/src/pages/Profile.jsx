// client/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PencilIcon } from "@heroicons/react/24/outline";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileEdit from "../components/profile/ProfileEdit";
import QuestionCard from "../components/questions/QuestionCard";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { userService } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("questions");

  const userId = id || currentUser?._id;
  const isOwnProfile = currentUser && currentUser._id === userId;

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [userResponse, statsResponse] = await Promise.all([
        userService.getOne(userId),
        userService.getStats(userId),
      ]);
      setUserData(userResponse.data.user);
      setQuestions(userResponse.data.questions);
      setAnswers(userResponse.data.answers);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserData((prev) => ({ ...prev, ...updatedUser }));
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-dark-800 dark:text-dark-200">
          User not found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Profile Card */}
        <div className="relative">
          <ProfileCard user={userData} stats={stats} />
          {isOwnProfile && (
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(true)}
              className="absolute top-4 right-4"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-dark-200 dark:border-dark-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("questions")}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "questions"
                  ? "border-[#faf5ff]0 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
              }`}
            >
              Questions ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab("answers")}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "answers"
                  ? "border-[#faf5ff]0 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
              }`}
            >
              Answers ({answers.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            {questions.length === 0 ? (
              <p className="text-center py-8 text-dark-500">
                No questions asked yet
              </p>
            ) : (
              questions.map((question, index) => (
                <QuestionCard
                  key={question._id}
                  question={{ ...question, author: userData }}
                  index={index}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "answers" && (
          <div className="space-y-4">
            {answers.length === 0 ? (
              <p className="text-center py-8 text-dark-500">
                No answers given yet
              </p>
            ) : (
              answers.map((answer, index) => (
                <motion.div
                  key={answer._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="text-sm text-dark-500 mb-2">
                    Answered on:{" "}
                    <a
                      href={`/questions/${answer.question?._id}`}
                      className="text-primary-600 hover:underline"
                    >
                      {answer.question?.title}
                    </a>
                  </div>
                  <p className="text-dark-700 dark:text-dark-300 line-clamp-3">
                    {answer.body}
                  </p>
                  <div className="mt-2 text-sm text-dark-500">
                    {answer.voteScore} votes
                    {answer.isAccepted && (
                      <span className="ml-2 text-green-600">✓ Accepted</span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile"
          size="lg"
        >
          <ProfileEdit
            user={userData}
            onUpdate={handleProfileUpdate}
            onClose={() => setShowEditModal(false)}
          />
        </Modal>
      </motion.div>
    </div>
  );
};

export default Profile;
