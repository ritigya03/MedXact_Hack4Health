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

1. A clear summary of key findings (like deficiencies, test issues).
2. Medical concerns or trends across all reports.
3. Personalized suggestions including:
   - Modern medical guidance
   - Ayurvedic remedies
   - Home-made nuskhe
   - Lifestyle & diet changes
4. Progress tracking if previous reports are available.
5. Warnings if anything is risky or worsening.

Be clear, accurate, and culturally relevant to Indian context. Prefer natural treatments when safe.
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
