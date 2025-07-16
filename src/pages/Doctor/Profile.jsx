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
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
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
    return <div className="min-h-screen flex items-center justify-center text-lg text-slate-700">Loading profile...</div>;
  }

  if (!doctorData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Unable to load profile data.</div>;
  }

  const card = "bg-white rounded-2xl shadow-md border border-slate-200 p-6";

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
            <div className="relative">
              <label htmlFor="profile-upload" className="cursor-pointer">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{doctorData.fullName}</h2>
              <p className="text-sm text-gray-600">{doctorData.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/doctor/dashboard", { state: { doctorData } })}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Grid Cards - Now 3 columns */}
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
                <span>Joined: {doctorData.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* NEW: Certifications Section */}
          <div className={card}>
            <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Certifications
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Board Certified: {doctorData.boardCertified || "Yes"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileBadge className="w-4 h-4 text-emerald-500" />
                <span>Residency: {doctorData.residency || "ABC Medical Center"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Fellowship: {doctorData.fellowship || "Neuropsychiatry"}</span>
              </div>
              {/* Add more certifications as needed */}
              <div className="pt-2 mt-4 border-t border-slate-100">
                <button className="text-xs text-blue-600 hover:underline">
                  + Add New Certification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;