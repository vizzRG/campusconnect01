// server/models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    answerCount: {
      type: Number,
      default: 0,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.virtual("voteScore").get(function () {
  return this.upvotes.length - this.downvotes.length;
});

questionSchema.set("toJSON", { virtuals: true });
questionSchema.set("toObject", { virtuals: true });

const Question = mongoose.model("Question", questionSchema);
export default Question;
