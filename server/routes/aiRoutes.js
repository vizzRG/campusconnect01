// server/routes/aiRoutes.js
import express from "express";
import {
  enhanceQuestion,
  generateTags,
  checkGrammar,
} from "../controllers/aiController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// All AI routes require authentication
router.post("/enhance-question", protect, enhanceQuestion);
router.post("/generate-tags", protect, generateTags);
router.post("/check-grammar", protect, checkGrammar);

export default router;
