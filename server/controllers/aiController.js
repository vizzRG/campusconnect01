// server/controllers/aiController.js
import genAI from "../config/gemini.js";

export const enhanceQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    if (!title && !body) {
      return res.status(400).json({ message: "Title or body is required" });
    }

    const model = genAI.models;

    const prompt = `You are an expert at writing clear, professional, and well-structured questions for a college student Q&A platform called "Campus Connect". 

Your task is to enhance the following question to make it more professional, clear, and likely to receive helpful answers.

Original Title: ${title || "No title provided"}

Original Body/Description: ${body || "No description provided"}

Tags: ${tags?.join(", ") || "No tags"}

Please provide an enhanced version with:
1. A clear, concise, and descriptive title (max 150 characters)
2. A well-structured body that:
   - Clearly states the problem or question
   - Provides relevant context
   - Is formatted with proper paragraphs
   - Uses bullet points or numbered lists where appropriate
   - Is polite and professional in tone
   - Removes any grammatical errors
   - Keeps the original intent and meaning

IMPORTANT: 
- Keep the response in the same language as the original question
- Don't add information that wasn't in the original
- Don't make assumptions about details not provided
- Format the body using Markdown

Respond in the following JSON format only (no markdown code blocks, just raw JSON):
{
  "title": "Enhanced title here",
  "body": "Enhanced body here with proper markdown formatting"
}`;

    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt + "\n\n" }],
        },
      ],
    });
    const text = result.candidates[0].content.parts[0].text;

    // Parse the JSON response
    let enhanced;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      enhanced = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return res.status(500).json({
        message: "Failed to parse AI response",
        raw: text,
      });
    }

    res.json({
      success: true,
      enhanced: {
        title: enhanced.title || title,
        body: enhanced.body || body,
      },
    });
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    res.status(500).json({
      message: "Failed to enhance question with AI",
      error: error.message,
    });
  }
};

export const generateTags = async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title && !body) {
      return res.status(400).json({ message: "Title or body is required" });
    }

    const model = genAI.models;

    const prompt = `You are a helpful assistant for a college student Q&A platform called "Campus Connect".

Based on the following question, suggest up to 5 relevant tags that would help categorize this question.

Title: ${title || "No title"}
Body: ${body || "No body"}

Available tag categories include: academics, hostel, placement, clubs, events, library, canteen, sports, exams, attendance, projects, internship, seniors, freshers, college-life, fees, scholarships, transportation, health, mental-health, relationships, career, coding, assignments, labs, workshops, competitions, cultural, technical, management, faculty, administration

Respond with a JSON array of tag strings only (no markdown, just raw JSON array):
["tag1", "tag2", "tag3"]`;

    const result = await model.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result.candidates[0].content.parts[0].text;

    let tags;
    try {
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      tags = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse AI tags response:", text);
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    res.json({
      success: true,
      tags: tags
        .slice(0, 5)
        .map((tag) => tag.toLowerCase().replace(/\s+/g, "-")),
    });
  } catch (error) {
    console.error("AI Tag Generation Error:", error);
    res.status(500).json({
      message: "Failed to generate tags",
      error: error.message,
    });
  }
};

export const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const model = genAI.models;

    const prompt = `Check the following text for grammar, spelling, and punctuation errors. Provide corrections.

Text: "${text}"

Respond in JSON format only:
{
  "hasErrors": true/false,
  "correctedText": "corrected version here",
  "corrections": [
    {"original": "wrong text", "corrected": "right text", "reason": "explanation"}
  ]
}`;

    const result = await model.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const responseText = result.candidates[0].content.parts[0].text;

    let parsed;
    try {
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    res.json({
      success: true,
      ...parsed,
    });
  } catch (error) {
    console.error("Grammar Check Error:", error);
    res.status(500).json({
      message: "Failed to check grammar",
      error: error.message,
    });
  }
};
