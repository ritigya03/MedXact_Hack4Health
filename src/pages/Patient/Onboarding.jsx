// src/pages/Onboarding.jsx
import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "patients", user.uid), {
        age,
        height,
        weight,
        bloodType,
        bio,
      });

      navigate("/patient/profile"); // 🚀 Redirect to profile after onboarding
    } catch (error) {
      console.error("Error saving profile:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-green-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Complete Your Health Profile
        </h2>

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder={`Height (e.g. 5'6")`}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Weight (e.g. 60 kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Blood Type (e.g. O+)"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Short Bio (e.g. Yoga lover, marathon runner...)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
