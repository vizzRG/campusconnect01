// client/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import QuestionCard from "../components/questions/QuestionCard";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { questionService } from "../services/questionService";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionService.getAll({
        limit: 5,
        sort: "newest",
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Ask & Answer",
      description:
        "Got questions about college life? Get answers from students who've been there.",
    },
    {
      icon: UserGroupIcon,
      title: "Community Driven",
      description:
        "Connect with seniors, peers, and faculty. Build your network while learning.",
    },
    {
      icon: SparklesIcon,
      title: "Earn Reputation",
      description:
        "Help others and earn reputation points. Showcase your expertise.",
    },
    {
      icon: AcademicCapIcon,
      title: "Campus Life",
      description:
        "From academics to hostel tips, find everything about college life.",
    },
  ];

  const stats = [
    { label: "Questions Asked", value: "10K+" },
    { label: "Answers Given", value: "25K+" },
    { label: "Active Students", value: "5K+" },
    { label: "Colleges", value: "100+" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Campus Questions,{" "}
              <span className="bg-gradient-to-r from-primary-300 to-pink-300 bg-clip-text text-transparent">
                Answered
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              Connect with students across campuses. Ask questions about college
              life, academics, placements, and more. Get answers from those who
              know best.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/ask">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto  text-[#581c87] hover:bg-primary-50"
                  >
                    Ask a Question
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto  text-[#581c87] hover:bg-[#faf5ff] hover:text-white"
                  >
                    Get Started Free
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Link to="/questions">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                >
                  Browse Questions
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">
                  {stat.value}
                </div>
                <div className="text-primary-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-white dark:fill-dark-950"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white">
              Why Choose Campus Connect?
            </h2>
            <p className="mt-4 text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Everything you need to navigate college life successfully
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Questions Section */}
      <section className="py-20 bg-dark-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-dark-900 dark:text-white">
                Recent Questions
              </h2>
              <p className="mt-2 text-dark-600 dark:text-dark-400">
                See what students are asking about
              </p>
            </div>
            <Link to="/questions">
              <Button variant="ghost">
                View All
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question._id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl  mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Connect with Your Campus?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of students who are already helping each other
              succeed.
            </p>
            <div className="mt-8 flex justify-center">
              {user ? (
                <Link to="/ask">
                  <Button
                    size="lg"
                    className=" text-[#581c87] hover:bg-[#faf5ff] hover:text-white"
                  >
                    Ask Your First Question
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button
                    size="lg"
                    className=" text-[#581c87] hover:bg-[#faf5ff] hover:text-white "
                  >
                    Join Campus Connect Today
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
