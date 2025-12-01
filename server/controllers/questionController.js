// server/controllers/questionController.js
import Question from "../models/Question.js";
import User from "../models/User.js";
import Answer from "../models/Answer.js";

export const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "newest", tag, search } = req.query;

    let query = {};

    if (tag) {
      query.tags = tag.toLowerCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "votes":
        sortOption = { upvotes: -1 };
        break;
      case "unanswered":
        query.answerCount = 0;
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate("author", "username avatar reputation")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "username avatar reputation college year")
      .populate("acceptedAnswer");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    const question = await Question.create({
      title,
      body,
      tags: tags.map((tag) => tag.toLowerCase()),
      author: req.user._id,
    });

    // Update user's question count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { questionsAsked: 1 },
    });

    const populatedQuestion = await Question.findById(question._id).populate(
      "author",
      "username avatar reputation"
    );

    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, body, tags } = req.body;

    question.title = title || question.title;
    question.body = body || question.body;
    question.tags = tags ? tags.map((tag) => tag.toLowerCase()) : question.tags;

    await question.save();

    const updatedQuestion = await Question.findById(question._id).populate(
      "author",
      "username avatar reputation"
    );

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Delete all answers for this question
    await Answer.deleteMany({ question: question._id });

    await question.deleteOne();

    // Update user's question count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { questionsAsked: -1 },
    });

    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = question.upvotes.includes(userId);
    const hasDownvoted = question.downvotes.includes(userId);

    let reputationChange = 0;

    if (type === "up") {
      if (hasUpvoted) {
        question.upvotes.pull(userId);
        reputationChange = -10;
      } else {
        question.upvotes.push(userId);
        reputationChange = 10;
        if (hasDownvoted) {
          question.downvotes.pull(userId);
          reputationChange += 5;
        }
      }
    } else if (type === "down") {
      if (hasDownvoted) {
        question.downvotes.pull(userId);
        reputationChange = 5;
      } else {
        question.downvotes.push(userId);
        reputationChange = -5;
        if (hasUpvoted) {
          question.upvotes.pull(userId);
          reputationChange -= 10;
        }
      }
    }

    await question.save();

    // Update author's reputation
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: reputationChange },
    });

    res.json({
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
      voteScore: question.upvotes.length - question.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
