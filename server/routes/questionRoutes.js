// server/routes/questionRoutes.js
import express from "express";
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  getTags,
} from "../controllers/questionController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getQuestions);
router.get("/tags", getTags);
router.get("/:id", getQuestion);
router.post("/", protect, createQuestion);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);
router.post("/:id/vote", protect, voteQuestion);

export default router;
