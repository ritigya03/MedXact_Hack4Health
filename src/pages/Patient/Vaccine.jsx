"use client";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import AddVaccineForm from "./AddVaccineForm"; // Adjust path if needed
import VaccineChatbot from "../../components/VaccineChatbot"; // if you separate it

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Vaccines</h1>

      {/* ✅ Add Vaccine Form here */}
      <AddVaccineForm onAdd={fetchVaccines} />

      {/* ✅ List of vaccine cards */}
      <div className="mt-8 space-y-4">
        {vaccines.map((v) => (
          <div key={v.id} className="p-4 bg-white shadow rounded-xl space-y-1">
            <p><strong>Vaccine:</strong> {v.name}</p>
            <p><strong>Type:</strong> {v.type}</p>
            <p><strong>Date Taken:</strong> {v.date}</p>
            <p><strong>Next Dose:</strong> {v.nextDose || "N/A"}</p>
            <p><strong>Notes:</strong> {v.notes || "N/A"}</p>
            {v.certificateUrl && (
              <a
                href={v.certificateUrl}
                className="text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>

      {/* 🧠 Prevention Tips */}
      <div className="mt-10 bg-yellow-50 p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">🩺 Post-Vaccine Prevention Tips</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>Avoid heavy physical activity for 24 hours.</li>
          <li>Stay hydrated and eat light meals.</li>
          <li>Monitor for allergic reactions or swelling.</li>
          <li>Rest if feeling feverish or dizzy.</li>
        </ul>
      </div>
      {/* 💬 AI Chatbot for Vaccine Guidance */}
<div className="mt-10">
  <VaccineChatbot vaccines={vaccines} />
</div>
    </div>
  );
}
