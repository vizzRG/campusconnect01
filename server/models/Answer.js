// server/models/Answer.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
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
    isAccepted: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        body: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

answerSchema.virtual("voteScore").get(function () {
  return this.upvotes.length - this.downvotes.length;
});

answerSchema.set("toJSON", { virtuals: true });
answerSchema.set("toObject", { virtuals: true });

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
