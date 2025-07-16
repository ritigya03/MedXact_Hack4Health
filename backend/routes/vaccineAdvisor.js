// routes/vaccineAdvisor.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_URL = "https://api.together.xyz/v1/chat/completions";
const MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";

router.post("/", async (req, res) => {
  const { question, vaccines = [] } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const vaccineHistoryFormatted = vaccines.length
    ? `Here is the user's vaccine history:\n${vaccines
        .map((v, i) => `${i + 1}. ${v.name} | ${v.type} | Taken: ${v.date} | Next dose: ${v.nextDose || "N/A"} | Notes: ${v.notes || "None"}`)
        .join("\n")}\n\n`
    : "";

  const messages = [
    {
      role: "system",
      content: `
You are a Vaccine Advisor for Indian users. Given a user's vaccine history and a question, provide:

1. Helpful, clear, accurate advice about vaccines.
2. Culturally relevant tips (Indian context).
3. If possible, suggest:
   - Next vaccine doses (e.g., boosters, missed)
   - Post-care instructions
   - Ayurveda or home remedies (only if safe)
4. Warn if anything is overdue or high-risk.

Keep the tone friendly, reassuring, and informative.
      `.trim(),
    },
    {
      role: "user",
      content: vaccineHistoryFormatted + `Question: ${question}`,
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
        max_tokens: 600,
        temperature: 0.6,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Together API Error", details: result });
    }

    const reply = result.choices?.[0]?.message?.content;
    res.json({ answer: reply });

  } catch (err) {
    console.error("Vaccine Advisor error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
