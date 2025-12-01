// server/controllers/userController.js
import User from "../models/User.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "reputation" } = req.query;

    let sortOption = {};
    switch (sort) {
      case "reputation":
        sortOption = { reputation: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "name":
        sortOption = { username: 1 };
        break;
      default:
        sortOption = { reputation: -1 };
    }

    const users = await User.find()
      .select("-password -email")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's questions
    const questions = await Question.find({ author: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title voteScore answerCount createdAt tags");

    // Get user's answers
    const answers = await Answer.find({ author: user._id })
      .populate("question", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      questions,
      answers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, bio, college, year, branch, socialLinks } = req.body;

    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    user.username = username || user.username;
    user.bio = bio !== undefined ? bio : user.bio;
    user.college = college !== undefined ? college : user.college;
    user.year = year !== undefined ? year : user.year;
    user.branch = branch !== undefined ? branch : user.branch;
    user.socialLinks = socialLinks || user.socialLinks;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Process image with sharp
    const filename = `avatar-${req.user._id}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "../uploads", filename);

    await sharp(req.file.path)
      .resize(200, 200, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Delete original uploaded file
    fs.unlinkSync(req.file.path);

    user.avatar = `/uploads/${filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar) {
      const avatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    user.avatar = "";
    await user.save();

    res.json({ message: "Avatar deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;

    const user = await User.findById(userId).select("-password");

    const questionsCount = await Question.countDocuments({ author: userId });
    const answersCount = await Answer.countDocuments({ author: userId });
    const acceptedAnswers = await Answer.countDocuments({
      author: userId,
      isAccepted: true,
    });

    res.json({
      reputation: user.reputation,
      questionsCount,
      answersCount,
      acceptedAnswers,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
