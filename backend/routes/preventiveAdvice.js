// preventiveAdvice.js
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

  // Combine previous and current reports if any
  const historyBlock = reportHistory.length > 0
    ? `Previous Reports:\n${reportHistory.join("\n\n")}\n\nLatest Report:\n${text}`
    : text;

  const messages = [
    {
      role: "system",
      content: `You are a health advisor for Indian users who focuses strictly on preventive healthcare.

Your job is:
- Read the given health report(s).
- Based ONLY on the health context, provide preventive measures and actionable recommendations.

Structure your reply in these sections (with headings):

1. **Preventive Measures**
   - Give 4-5 crisp preventive steps relevant to the user's health concerns.
   - Keep each point short, clear, and practical for Indian users.

2. **Ayurvedic Remedies / Cures**
   - Suggest 3 safe Ayurvedic herbs or remedies helpful for the findings.
   - Mention any precautions if needed.
   - Use short one-liners, no long paragraphs.

3. **Home Remedies**
   - Recommend 3 simple home-based solutions suitable for Indian households.
   - Keep each suggestion in one line.

4. **Lifestyle and Diet Plan**
   - Give 3-4 quick lifestyle tips (exercise, sleep, stress).
   - Briefly list:
     - foods to eat
     - foods to avoid
     - simple meal planning tips
   - Keep each point short and direct.

5. **Daily Health Goals**
   - Summarize everything into 5 short daily health goals users can easily follow.

Additional guidelines:
- Use simple, easy-to-understand language.
- Prefer one-liners over paragraphs.
- Focus on safe, practical, culturally relevant advice.
- Prefer natural methods where safe, but don’t ignore medical realities.
- Do NOT repeat the health report text back; focus only on preventive guidance.

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
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Together API Error",
        details: result,
      });
    }

    const reply = result.choices?.[0]?.message?.content;
    res.json({ preventiveAdvice: reply });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
