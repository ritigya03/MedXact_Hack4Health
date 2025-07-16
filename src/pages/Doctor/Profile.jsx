"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  User,
  ClipboardCheck,
  GraduationCap,
  Stethoscope,
  Hospital,
  BadgePlus,
  Calendar,
  LogOut,
  Award,
  FileBadge,
  ShieldCheck,
} from "lucide-react";

const DoctorProfile = () => {
  // ... [keep all your existing state and functions] ...

  // Modify the card style to be more transparent
  const card = "bg-white/80 rounded-2xl shadow-md border border-slate-200/50 p-6 backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-10">
      <Navbar userType="doctor" />

      {/* Top-right Logout Button */}
      <div className="max-w-6xl mx-auto px-4 flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Info - Now with gradient */}
        <div className={`bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl shadow-md border border-white/30 p-6 flex items-center justify-between`}>
          {/* ... [keep existing header content] ... */}
        </div>

        {/* Grid Cards - Now with glass morphism effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Professional Info */}
          <div className={`${card} border-blue-100/50`}>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              <Stethoscope className="inline mr-2 w-5 h-5" />
              Professional Info
            </h3>
            {/* ... [keep existing content] ... */}
          </div>

          {/* Personal Info */}
          <div className={`${card} border-purple-100/50`}>
            <h3 className="text-lg font-semibold mb-4 text-purple-700">
              <User className="inline mr-2 w-5 h-5" />
              Personal Info
            </h3>
            {/* ... [keep existing content] ... */}
          </div>

          {/* Certifications */}
          <div className={`${card} border-pink-100/50`}>
            <h3 className="text-lg font-semibold mb-4 text-pink-700">
              <Award className="inline mr-2 w-5 h-5" />
              Certifications
            </h3>
            {/* ... [keep existing content] ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;