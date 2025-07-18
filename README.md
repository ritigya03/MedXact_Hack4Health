# MEDXact – AI-Driven Preventive Healthcare Assistant

## Problem
Many serious health problems are not caught early. Most healthcare systems only act after someone gets sick. Because of this, diseases are diagnosed late, patients end up in emergencies, and many hospital visits could have been avoided.

## Solution
*MEDXact* transforms healthcare from *reactive to proactive* by using AI to:

- Analyze medical reports and detect early health risks  
- Trigger real-time alerts to doctors when danger signs emerge  
- Track vaccines, booster doses, and health goals  
- Guide patients with personalized lifestyle recommendations  

## ⚙️ Features

- *AI Medical Insight*: Understand trends, deficiencies, and risks in uploaded health reports  
- *Doctor Appointment Management*: Patients book, doctors manage  
- *AI Chatbot*: Personalized health advice using Mixtral-8x7B  
- *Vaccine Tracker*: Manage past vaccines, schedule next doses, and get reminders  
- *Smart Alerts*: Early warnings to doctors/patients when reports show red flags  
- *Health Dashboard*: Visualize your health data, progress, and goals

##  Impact

- Patients avoid preventable crises  
- Doctors catch problems earlier  
- Hospitals reduce unnecessary emergency cases  

Together, *MEDXact* brings a proactive, data-driven shift in Indian preventive healthcare.

---

## Tech Stack

| Layer          | Technologies                              |
|----------------|--------------------------------------------|
| Frontend       | React, Tailwind, Vite                     |
| Backend        | Node.js, Express, Firebase                |
| AI & NLP       | OpenAI, Together AI (Mixtral 8x7B)        |
| Database       | Firebase Firestore                        |
| Charts & UI    | Chart.js, React Chart.js 2                |
| Hosting        | Firebase / Vercel / Render                |


FOLDER STRUCTURE
/src
  /components        # UI Components
  /pages
    /Patient         # Patient views (Dashboard, Vaccine, etc.)
    /Doctor          # Doctor views
  /backend           # Express API routes (healthInsights, vaccineAdvisor)
  /firebase          # Firebase config & Firestore rules


## Getting Started

1. Clone the repo  
```bash
git clone https://github.com/your-username/MEDXact.git
cd MEDXact

2. Install the Dependencies
npm install
npm install chart.js react-chartjs-2


Frontend (React + Vite)
cd src
npm install            # installs frontend dependencies
npm run dev            # starts frontend at http://localhost:5173

FOR BACKEND
cd backend
npm install            # installs backend dependencies
npm run dev            # starts backend server (e.g., on http://localhost:5000)


Configure Environment Variables
Inside /backend, create a .env file:
HF_TOKEN=your-huggingface-token-here
TOGETHER_API_KEY=your-together-api-key-here


How to Use

👨‍⚕️ Doctor Flow
Login/Register via /doctor/onboarding
Use ConsentAI to analyze patient reports
View and manage appointments in the dashboard

🧑‍💼 Patient Flow
Login/Register via /onboarding
Upload medical reports (PDFs) for AI-based insights
View health summary and AI suggestions
Go to Vaccine tab to:
Add vaccine history & next doses
Get reminders
Upload certificates
Chat with Vaccine Advisor
Track health progress over time
