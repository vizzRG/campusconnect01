// server/controllers/answerController.js
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

export const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { sort = "votes" } = req.query;

    let sortOption = {};
    switch (sort) {
      case "votes":
        sortOption = { upvotes: -1, createdAt: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { isAccepted: -1, upvotes: -1 };
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "username avatar reputation college year")
      .populate("comments.author", "username avatar")
      .sort(sortOption);

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { body } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = await Answer.create({
      body,
      question: questionId,
      author: req.user._id,
    });

    // Update question's answer count
    question.answerCount += 1;
    await question.save();

    // Update user's answer count and reputation
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { answersGiven: 1, reputation: 5 },
    });

    const populatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      "username avatar reputation college year"
    );

    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    answer.body = req.body.body || answer.body;
    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      "username avatar reputation"
    );

    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update question's answer count
    await Question.findByIdAndUpdate(answer.question, {
      $inc: { answerCount: -1 },
    });

    // Update user's answer count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { answersGiven: -1 },
    });

    await answer.deleteOne();

    res.json({ message: "Answer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const voteAnswer = async (req, res) => {
  try {
    const { type } = req.body;
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const userId = req.user._id;
    const hasUpvoted = answer.upvotes.includes(userId);
    const hasDownvoted = answer.downvotes.includes(userId);

    let reputationChange = 0;

    if (type === "up") {
      if (hasUpvoted) {
        answer.upvotes.pull(userId);
        reputationChange = -10;
      } else {
        answer.upvotes.push(userId);
        reputationChange = 10;
        if (hasDownvoted) {
          answer.downvotes.pull(userId);
          reputationChange += 5;
        }
      }
    } else if (type === "down") {
      if (hasDownvoted) {
        answer.downvotes.pull(userId);
        reputationChange = 5;
      } else {
        answer.downvotes.push(userId);
        reputationChange = -5;
        if (hasUpvoted) {
          answer.upvotes.pull(userId);
          reputationChange -= 10;
        }
      }
    }

    await answer.save();

    // Update author's reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: reputationChange },
    });

    res.json({
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
      voteScore: answer.upvotes.length - answer.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const question = await Question.findById(answer.question);

    if (!answer || !question) {
      return res.status(404).json({ message: "Answer or Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Only question author can accept answer" });
    }

    // Remove previous accepted answer if exists
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, {
        isAccepted: false,
      });
      // Remove reputation from previous accepted answer author
      const prevAnswer = await Answer.findById(question.acceptedAnswer);
      if (prevAnswer) {
        await User.findByIdAndUpdate(prevAnswer.author, {
          $inc: { reputation: -15 },
        });
      }
    }

    answer.isAccepted = true;
    await answer.save();

    question.isAccepted = true;
    question.acceptedAnswer = answer._id;
    await question.save();

    // Add reputation to answer author
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: 15 },
    });

    res.json({ message: "Answer accepted", answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    answer.comments.push({
      body: req.body.body,
      author: req.user._id,
    });

    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate("author", "username avatar reputation")
      .populate("comments.author", "username avatar");

    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
