import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { doctor, patient, requestDetails } = req.body;

  // Load access rules dynamically
  const rulesPath = path.resolve("accessRules.json");
  const accessRules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

  // Format rules section dynamically
  let formattedRules = "";
  for (const [specialization, accesses] of Object.entries(accessRules)) {
    formattedRules += `\n${specialization} may access:\n - ${accesses.join("\n - ")}\n`;
  }

  const input = `
You are a medical compliance analysis system. Analyze this request and respond in perfect JSON format:

{
  "status": "genuine|suspicious",
  "confidence": 0-100,
  "red_flags": ["...", "..."],
  "reason": "Detailed explanation"
}
Respond strictly in the following JSON structure:
{
  "status": "genuine" or "suspicious",
  "confidence": a number between 0 and 100,
  "red_flags": array of strings, 
  "reason": short explanation of the decision
}

--- ANALYSIS RULES ---
1. License Format: 3 letters + 5 numbers (e.g. ABC12345)
${formattedRules}
2. Note: If the clinic is missing or unrecognized, do not penalize the request. Use other factors such as license and specialization.


--- REQUEST DETAILS ---
Doctor:
- Name: ${doctor.fullName}
- License: ${doctor.licenseNumber}
- Clinic: ${doctor.associatedClinic || "Not provided (assume neutral)"}

- Specialization: ${doctor.specialization}

Patient:
- Name: ${patient.fullName}
- Email: ${patient.email}

Purpose: "${requestDetails}"
`;

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: input }],
        temperature: 0.3,
        max_tokens: 500
      }),
      timeout: 15000
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty or malformed AI response");

    let result = {};
    try {
      result = JSON.parse(raw);
      if (!result.status || typeof result.confidence !== 'number') {
        throw new Error("Invalid structure in AI response");
      }
    } catch (e) {
      console.error("Parsing error:", raw);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    return res.json(result);
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({
      error: "Analysis failed",
      details: error.message,
      request_id: Date.now()
    });
  }
});

export default router;
