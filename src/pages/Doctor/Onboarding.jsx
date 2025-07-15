import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import QRCode from "react-qr-code";

const generateUniqueId = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase() +
  Math.random().toString(36).substring(2, 6).toUpperCase();

const DoctorOnboarding = () => {
  const [formData, setFormData] = useState({
    specialization: "",
    associatedClinic: "",
    degree: "",
    college: "",
    age: "",
    sex: "",
  });
  const [uniqueId, setUniqueId] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "doctors", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setDoctorData(data);
        setFormData(prev => ({
          ...prev,
          ...data,
        }));

        if (!data.uniqueId) {
          const newId = generateUniqueId();
          await updateDoc(docRef, { uniqueId: newId });
          setUniqueId(newId);
        } else {
          setUniqueId(data.uniqueId);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "doctors", user.uid);
    await updateDoc(docRef, {
      ...formData,
    });

    alert("Doctor profile saved successfully!");
    navigate("/doctor/profile");
  };

  const qrData = JSON.stringify({
    name: doctorData?.fullName,
    license: doctorData?.licenseNumber,
    specialization: formData.specialization,
  });

  if (loading) return <div className="p-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold">Doctor Onboarding</h1>

      {["specialization", "associatedClinic", "degree", "college", "age", "sex"].map(field => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {field.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            value={formData[field] || ""}
            onChange={e => handleChange(field, e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            placeholder={`Enter ${field}`}
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
      >
        Save Profile
      </button>

      {uniqueId && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Doctor QR Code</h2>
          <QRCode value={qrData} size={160} className="mx-auto" />
          <p className="mt-4 text-sm text-gray-600">
            Unique ID: <span className="font-mono">{uniqueId}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Scan to access public doctor profile
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorOnboarding;
