// healthInsights.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_URL = "https://api.together.xyz/v1/chat/completions";
const MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";

router.post("/", async (req, res) => {
  const { text, reportHistory = [] } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Compose full message history for multi-report analysis
  const historyBlock = reportHistory.length > 0
    ? `Previous Reports:\n${reportHistory.join("\n\n")}\n\nLatest Report:\n${text}`
    : text;

  const messages = [
    {
      role: "system",
      content: `
You are a health advisor for Indian users. Read the given health report(s), and provide:
1- Clear Summary of Key Findings
  -A very brief analysis of all reports (if previous data is available).
  -Highlight abnormal or borderline test results (e.g. deficiencies, excesses, alarming values).
  -Point out any missing or incomplete tests, or unusual trends in results.
  -Organize the findings clearly and neatly .
  
2- Medical Concerns or Trends
  -Identify any significant health risks or patterns across all reports (e.g. consistently high sugar levels, persistent anemia, worsening markers).
  -Suggest disease names that can be inferred or happen in future

3- Warnings / Red Flags (important dedicated section)
  -Flag any values that are in dangerous ranges and recommend immediate medical consultation if required.
  -Mention worsening trends compared to previous reports (if past data is available).

4- Progress Tracking (If previous reports exist)
  -Compare current findings to previous reports and show improvements, deterioration, or stability in key parameters.
Be clear, accurate, and culturally very relevant to Indian context. Prefer natural treatments when safe.
      `.trim(),
    },
    {
      role: "user",
      content: historyBlock,
    },
  ];

  try {
    const response = await fetch(TOGETHER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 700,
        temperature: 0.6,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Together API Error", details: result });
    }

    const reply = result.choices?.[0]?.message?.content;
    res.json({ summary: reply });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
