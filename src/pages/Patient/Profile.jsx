"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  User,
  Copy,
  Check,
  Heart,
  Calendar,
  MapPin,
  Activity,
  Pill,
  Phone,
  Pencil,
  Save,
} from "lucide-react";
import Navbar from "../../components/Navbar";

const generateUniqueId = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase() +
  Math.random().toString(36).substring(2, 6).toUpperCase();

const PatientProfile = () => {
  const [copied, setCopied] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showID, setShowID] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "patients", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        if (!data.uniqueId) {
          const newId = generateUniqueId();
          await updateDoc(docRef, { uniqueId: newId });
          data.uniqueId = newId;
        }

        setPatientData(data);
        setFormData(data);
      } else {
        alert("Patient data not found.");
      }
      setLoading(false);
    };

    fetchPatientData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "patients", user.uid);
    await updateDoc(docRef, formData);
    setPatientData(formData);
    setEditMode(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const cardClass =
    "bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-slate-700">
        Loading profile...
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unable to load profile data.
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10">
      <Navbar userType="patient" />

      <div className="max-w-screen mx-auto px-20 py-10">
        <div className="flex justify-end mb-6 space-x-4">
          <button
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editMode ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <div className={cardClass}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={e => handleChange("fullName", e.target.value)}
                        className="text-xl font-semibold text-slate-900 border px-2 py-1 rounded"
                      />
                    ) : (
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {patientData.fullName || "N/A"}
                      </h2>
                    )}
                    <div className="mt-2 text-slate-600 space-y-1 text-sm">
                      {[
                        { label: "Age", field: "age", icon: Calendar },
                        { label: "Location", field: "location", icon: MapPin },
                        { label: "Blood Type", field: "bloodType", icon: Heart },
                        { label: "Height", field: "height", icon: Activity },
                        { label: "Weight", field: "weight", icon: Pill },
                      ].map(({ label, field, icon: Icon }) => (
                        <div className="flex items-center space-x-2" key={field}>
                          <Icon className="w-4 h-4" />
                          {editMode ? (
                            <input
                              type="text"
                              value={formData[field] || ""}
                              onChange={e => handleChange(field, e.target.value)}
                              className="border px-1 py-0.5 rounded text-sm"
                            />
                          ) : (
                            <span>
                              {label}: {patientData[field] || "N/A"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {patientData.healthId && (
                  <div className="mt-6 sm:mt-0 text-right">
                    <p className="text-sm text-slate-500 mb-1">Health ID</p>
                    <div className="flex items-center justify-end space-x-3">
                      <p className="text-base font-mono text-slate-900">
                        {patientData.healthId}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(patientData.healthId, "healthId")
                        }
                        className="p-2 hover:bg-slate-100 rounded-xl"
                      >
                        {copied === "healthId" ? (
                          <Check className="w-4 h-4 text-teal-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={cardClass}>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                About Me
              </h3>
              {editMode ? (
                <textarea
                  value={formData.bio || ""}
                  onChange={e => handleChange("bio", e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                />
              ) : (
                <p className="text-slate-600 text-sm">{patientData.bio}</p>
              )}
            </div>

            <div className={cardClass}>
              <h3 className="text-xl font-semibold text-slate-800 mb-2 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-yellow-500" />
                Emergency Contact
              </h3>
              {editMode ? (
                <input
                  type="text"
                  value={formData.emergencyContact || ""}
                  onChange={e =>
                    handleChange("emergencyContact", e.target.value)
                  }
                  className="w-full border rounded p-2 text-sm"
                />
              ) : (
                <p className="text-slate-600 text-sm">
                  {patientData.emergencyContact}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className={cardClass}>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                Emergency ID
              </h3>

              <button
                onClick={() => setShowID(prev => !prev)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <User className="h-5 w-5" />
                <span>{showID ? "Hide ID" : "Show ID"}</span>
              </button>

              {showID && (
                <div className="mt-6 text-center text-sm text-gray-800">
                  <p className="font-mono">
                    Unique ID: {patientData.uniqueId}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(patientData.uniqueId, "uniqueId")
                    }
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {copied === "uniqueId" ? "Copied!" : "Copy ID"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
