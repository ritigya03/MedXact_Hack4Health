"use client";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import AddVaccineForm from "./AddVaccineForm";
import VaccineChatbot from "../../components/VaccineChatbot";
import Navbar from "../../components/Navbar";

export default function Vaccine() {
  const [vaccines, setVaccines] = useState([]);

  const fetchVaccines = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const vaccineRef = collection(db, "patients", user.uid, "vaccines");
    const snapshot = await getDocs(vaccineRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setVaccines(data);
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const cardClass =
    "bg-white/10 backdrop-blur-md rounded-2xl border border-cyan-200 p-6 sm:p-8 shadow-md";

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: "linear-gradient(to bottom right, #eff6ff, #ccfbf1)" }}
    >
      <Navbar userType="patient" />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-24">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          💉 Your Vaccination Records
        </h1>

        <div className={`${cardClass} mb-8`}>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Add a New Vaccine
          </h2>
          <AddVaccineForm onAdd={fetchVaccines} />
        </div>

        <div className="space-y-6">
          {vaccines.length === 0 ? (
            <p className="text-slate-600 text-sm">No vaccines recorded yet.</p>
          ) : (
            vaccines.map((v) => (
              <div key={v.id} className={cardClass}>
                <div className="space-y-1 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Vaccine:</span>{" "}
                    {v.name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Type:</span>{" "}
                    {v.type}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Date Taken:</span>{" "}
                    {v.date}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Next Dose:</span>{" "}
                    {v.nextDose || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Notes:</span>{" "}
                    {v.notes || "N/A"}
                  </p>
                  {v.certificateUrl && (
                    <p>
                      <a
                        href={v.certificateUrl}
                        className="text-teal-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Certificate
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🩺 Post-Vaccine Prevention Tips */}
        <div
          className="rounded-2xl border border-cyan-100 p-6 sm:p-8 shadow-md mt-10"
          style={{
            backgroundColor: "rgba(255, 248, 225, 0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🩺 Post-Vaccine Prevention Tips
          </h2>
          <ul className="list-disc ml-5 text-sm space-y-1 text-slate-700">
            <li>Avoid heavy physical activity for 24 hours.</li>
            <li>Stay hydrated and eat light meals.</li>
            <li>Monitor for allergic reactions or swelling.</li>
            <li>Rest if feeling feverish or dizzy.</li>
          </ul>
        </div>

        {/* 💬 Vaccine Chatbot */}
        <div className={`${cardClass} mt-10`}>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            💬 Ask our Vaccine Chatbot
          </h2>
          <VaccineChatbot vaccines={vaccines} />
        </div>
      </div>
    </div>
  );
}
