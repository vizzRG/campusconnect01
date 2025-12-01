// client/src/components/profile/ReputationBadge.jsx
import React from "react";
import { motion } from "framer-motion";
import { StarIcon, TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";

const ReputationBadge = ({ reputation }) => {
  const getBadge = () => {
    if (reputation >= 10000) {
      return {
        name: "Legend",
        color: "from-yellow-400 to-orange-500",
        icon: TrophyIcon,
      };
    } else if (reputation >= 5000) {
      return {
        name: "Expert",
        color: "from-purple-400 to-pink-500",
        icon: SparklesIcon,
      };
    } else if (reputation >= 1000) {
      return {
        name: "Pro",
        color: "from-blue-400 to-cyan-500",
        icon: StarIcon,
      };
    } else if (reputation >= 500) {
      return {
        name: "Rising Star",
        color: "from-green-400 to-emerald-500",
        icon: StarIcon,
      };
    } else if (reputation >= 100) {
      return {
        name: "Contributor",
        color: "from-primary-400 to-primary-600",
        icon: StarIcon,
      };
    } else {
      return {
        name: "Newbie",
        color: "from-dark-400 to-dark-600",
        icon: StarIcon,
      };
    }
  };

  const badge = getBadge();
  const Icon = badge.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-r ${badge.color} rounded-xl p-4 text-white text-center min-w-[120px]`}
    >
      <Icon className="w-8 h-8 mx-auto mb-2" />
      <div className="text-2xl font-bold">{reputation}</div>
      <div className="text-xs opacity-90">{badge.name}</div>
    </motion.div>
  );
};

export default ReputationBadge;
