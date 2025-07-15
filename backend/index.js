import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // at top
import consentAnalysis from "./routes/consentAnalysis.js";
import healthInsights from "./routes/healthInsights.js"

const app = express();

app.use(cors());
app.use(express.json()); // Required to parse JSON body

app.use("/analyze", consentAnalysis); // This means route becomes /analyze/consent-analysis
app.use("/api/insights", healthInsights); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Consent Bot running on port ${PORT}`);
});
