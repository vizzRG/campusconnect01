// server/config/gemini.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
}); //GEMINI_API_KEY

export default genAI;
