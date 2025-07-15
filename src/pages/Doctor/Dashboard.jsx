"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { Send } from "lucide-react";

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [timelineMinutes, setTimelineMinutes] = useState("");
  const [consentSent, setConsentSent] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docSnap = await getDoc(doc(db, "doctors", user.uid));
        if (docSnap.exists()) {
          setDoctorData({
            ...docSnap.data(),
            uid: user.uid,
          });
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    };

    fetchDoctorData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    let patient = null;

    // Search by uniqueId
    const q1 = query(
      collection(db, "patients"),
      where("uniqueId", "==", searchQuery)
    );
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      patient = snap1.docs[0];
    }

    // If not found, search by email
    if (!patient) {
      const q2 = query(
        collection(db, "patients"),
        where("email", "==", searchQuery)
      );
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        patient = snap2.docs[0];
      }
    }

    // If not found, search by fullName
    if (!patient) {
      const q3 = query(
        collection(db, "patients"),
        where("fullName", "==", searchQuery)
      );
      const snap3 = await getDocs(q3);
      if (!snap3.empty) {
        patient = snap3.docs[0];
      }
    }

    if (patient) {
      const data = patient.data();

      // TEMP: attach mock reports
      setSelectedPatient({
        id: patient.id,
        ...data,
        reports: [
          {
            name: "Diabetes.pdf",
            date: "2025-06-28",
            type: "Lab Report",
            size: "2.3 MB",
          },
          {
            name: "Blood_Test.pdf",
            date: "2025-06-20",
            type: "Lab Report",
            size: "1.8 MB",
          },
        ],
      });
      setConsentSent(false);
      setPurpose("");
      setTimelineMinutes("");
    } else {
      setSelectedPatient(null);
      setConsentSent(false);
    }
  };

  const handleRequestConsent = async () => {
    if (!purpose.trim() || !timelineMinutes.trim()) {
      alert("Please fill in purpose and timeline.");
      return;
    }

    try {
      await addDoc(
        collection(
          db,
          "patients",
          selectedPatient.id,
          "consentRequests"
        ),
        {
          doctorId: doctorData.uid,
          doctorName: doctorData.fullName || "Unknown Doctor",
          clinic: doctorData.associatedClinic || "Unknown Clinic",
          healthId: selectedPatient.uniqueId,
          patientName: selectedPatient.fullName,
          purpose,
          timelineMinutes,
          timestamp: serverTimestamp(),
          status: "pending",
        }
      );
      setConsentSent(true);
      setPurpose("");
      setTimelineMinutes("");
    } catch (err) {
      console.error("Error sending consent request:", err);
      alert("Failed to send consent request.");
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar userType="doctor"/>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Card */}
        <div className="bg-white border border-teal-200 rounded-lg mb-8 p-6">
          <h2 className="text-lg font-semibold text-teal-800 mb-4">
            Patient Search
          </h2>
          <div className="flex gap-4">
            <input
              className="border border-teal-300 rounded px-3 py-2 flex-1"
              placeholder="Search by Unique ID, Email, or Full Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded"
            >
              🔎 Search
            </button>
          </div>
        </div>

        {selectedPatient ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Profile */}
            <div className="bg-white border border-blue-200 rounded-lg p-6">
              <h3 className="text-blue-800 text-lg font-semibold mb-4">
                Patient Profile
              </h3>
              <div className="space-y-3 text-gray-800">
                <div>
                  <span className="text-gray-500 text-sm">Full Name:</span>
                  <p className="font-medium">{selectedPatient.fullName}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Unique ID:</span>
                  <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                    {selectedPatient.uniqueId}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Email:</span>
                  <p>{selectedPatient.email}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Age:</span>
                  <p>{selectedPatient.age}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Bio:</span>
                  <p>{selectedPatient.bio}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Blood Type:</span>
                  <p>{selectedPatient.bloodType}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Height:</span>
                  <p>{selectedPatient.height}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Weight:</span>
                  <p>{selectedPatient.weight}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Joined At:</span>
                  <p>
                    {new Date(selectedPatient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="lg:col-span-2 bg-white border border-teal-200 rounded-lg p-6">
              <h3 className="text-teal-800 text-lg font-semibold mb-4">
                Medical Reports ({selectedPatient.reports.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-teal-100">
                      <th className="py-3 px-4 font-medium text-gray-700">
                        File Name
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700">
                        Type
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700">
                        Date Uploaded
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700">
                        Size
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.reports.map((report, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-teal-50"
                      >
                        <td className="py-3 px-4">{report.name}</td>
                        <td className="py-3 px-4">{report.type}</td>
                        <td className="py-3 px-4">{report.date}</td>
                        <td className="py-3 px-4">{report.size}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-teal-700 border border-teal-200 px-2 py-1 rounded hover:bg-teal-50">
                              Request Consent
                            </button>
                            {/* <button className="text-blue-700 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50">
                              Download
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Consent Request Form */}
              {doctorData && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-bold text-teal-700 mb-4">
                    Request Consent from {selectedPatient.fullName}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Purpose of Consent
                      </label>
                      <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g., Review imaging for diagnosis"
                        className="w-full border p-2 rounded-md border-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Timeline (minutes)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={timelineMinutes}
                        onChange={(e) => setTimelineMinutes(e.target.value)}
                        placeholder="e.g., 30"
                        className="w-full border p-2 rounded-md border-gray-300"
                      />
                    </div>

                    <button
                      onClick={handleRequestConsent}
                      className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                      <Send className="w-4 h-4" />
                      Request Consent
                    </button>

                    {consentSent && (
                      <p className="text-green-600 mt-2 font-medium text-sm">
                        ✅ Consent request sent successfully!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Patient Selected
            </h3>
            <p className="text-gray-600">
              Use the search bar above to find a patient by unique ID, email, or
              name.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
