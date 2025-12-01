// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      enum: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Alumni",
        "Faculty",
        "",
      ],
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    reputation: {
      type: Number,
      default: 0,
    },
    questionsAsked: {
      type: Number,
      default: 0,
    },
    answersGiven: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        name: String,
        icon: String,
        earnedAt: Date,
      },
    ],
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
