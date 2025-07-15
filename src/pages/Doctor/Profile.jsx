"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../../components/Navbar";
import QRCode from "react-qr-code";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  User,
  ClipboardCheck,
  GraduationCap,
  Stethoscope,
  Hospital,
  QrCode,
  BadgePlus,
  Calendar,
  LogOut,
} from "lucide-react";

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirects to Home.jsx
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "doctors", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctorData(docSnap.data());
      } else {
        alert("Doctor data not found.");
      }
      setLoading(false);
    };

    fetchDoctorData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-slate-700">
        Loading profile...
      </div>
    );
  }

  if (!doctorData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unable to load profile data.
      </div>
    );
  }

  const qrData = JSON.stringify({
    name: doctorData.fullName,
    license: doctorData.licenseNumber,
    specialization: doctorData.specialization,
  });

  const card =
    "bg-white rounded-2xl shadow-md border border-slate-200 p-6";

  return (
    <div className="min-h-screen mt-10 bg-slate-50 pt-10">
      <Navbar userType="doctor" />

      {/* Top-right Logout Button */}
      <div className="max-w-6xl mx-auto px-4 flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Info */}
        <div className={`${card} flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{doctorData.fullName}</h2>
              <p className="text-sm text-gray-600">{doctorData.email}</p>
            </div>
          </div>
          <button
            onClick={() =>
              navigate("/doctor/dashboard", { state: { doctorData } })
            }
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Professional Info */}
          <div className={card}>
            <h3 className="text-lg font-semibold mb-4 text-teal-700">
              Professional Info
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-purple-600" />
                <span>Specialization: {doctorData.specialization || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hospital className="w-4 h-4 text-pink-500" />
                <span>Clinic: {doctorData.associatedClinic || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClipboardCheck className="w-4 h-4 text-green-600" />
                <span>License No: {doctorData.licenseNumber || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className={card}>
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">
              Personal Info
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>Degree: {doctorData.degree || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-teal-500" />
                <span>College: {doctorData.college || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BadgePlus className="w-4 h-4 text-orange-500" />
                <span>Age: {doctorData.age || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BadgePlus className="w-4 h-4 text-rose-500" />
                <span>Sex: {doctorData.sex || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  Joined:{" "}
                  {doctorData.createdAt?.split("T")[0] || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* QR Section */}
          <div
            className={`${card} flex flex-col items-center justify-center text-center`}
          >
            <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-600">
              <QrCode className="w-5 h-5 mr-2" />
              Doctor QR Code
            </h3>
            <QRCode value={qrData} size={160} className="my-4" />
            <p className="text-sm text-gray-700">
              Unique ID:{" "}
              <span className="font-mono">
                {doctorData.uniqueId || "N/A"}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Scan to view public doctor info
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
