// server/routes/answerRoutes.js
import express from "express";
import {
  getAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
  addComment,
} from "../controllers/answerController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/question/:questionId", getAnswers);
router.post("/question/:questionId", protect, createAnswer);
router.put("/:id", protect, updateAnswer);
router.delete("/:id", protect, deleteAnswer);
router.post("/:id/vote", protect, voteAnswer);
router.post("/:id/accept", protect, acceptAnswer);
router.post("/:id/comment", protect, addComment);

export default router;
