// server/config/gemini.js
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: "AIzaSyBMeaBJFwMGiBNuyBXJWTsVn1LKBgm8XGo",
}); //GEMINI_API_KEY

export default genAI;
