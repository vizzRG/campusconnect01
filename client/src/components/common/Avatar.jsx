// client/src/components/common/Avatar.jsx
import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const Avatar = ({ src, name, size = "md", className = "" }) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-xl",
    "2xl": "w-32 h-32 text-3xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name) => {
    if (!name) return "bg-[#faf5ff]0";
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={
          src.startsWith("http")
            ? src
            : `${process.env.REACT_APP_API_URL?.replace("/api", "")}${src}`
        }
        alt={name || "User avatar"}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-[#faf5ff]0/20 ${className}`}
      />
    );
  }

  if (name) {
    return (
      <div
        className={`${sizes[size]} ${getColorFromName(
          name
        )} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-[#faf5ff]0/20 ${className}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <UserCircleIcon
      className={`${sizes[size]} text-dark-400 dark:text-dark-600 ${className}`}
    />
  );
};

export default Avatar;
