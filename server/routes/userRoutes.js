// server/routes/userRoutes.js
import express from "express";
import {
  getUsers,
  getUser,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getUserStats,
} from "../controllers/userController.js";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/stats/:id?", protect, getUserStats);
router.get("/:id", getUser);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", protect, deleteAvatar);

export default router;
