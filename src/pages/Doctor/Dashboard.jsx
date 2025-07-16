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
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { Send, Eye, CheckCircle, Clock, Target } from "lucide-react";

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [timelineMinutes, setTimelineMinutes] = useState("");
  const [consentSent, setConsentSent] = useState(false);
  const [approvedConsents, setApprovedConsents] = useState([]);
  const [activeTab, setActiveTab] = useState("reports"); // "reports" or "goals"

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

  const checkApprovedConsents = async (patientId) => {
    if (!doctorData) return [];

    try {
      const consentQuery = query(
        collection(db, "patients", patientId, "consentRequests"),
        where("doctorId", "==", doctorData.uid),
        where("status", "==", "approved")
      );
      
      const consentSnap = await getDocs(consentQuery);
      return consentSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error("Error checking approved consents:", err);
      return [];
    }
  };

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

      // Fetch healthRecords from Firestore
      let healthRecords = [];
      try {
        const healthRecordsSnap = await getDocs(
          collection(db, "patients", patient.id, "healthRecords")
        );

        healthRecords = healthRecordsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (err) {
        console.error("Error fetching health records:", err);
      }

      // Fetch healthGoals from Firestore
      let healthGoals = [];
      try {
        const healthGoalsSnap = await getDocs(
          collection(db, "patients", patient.id, "healthGoals")
        );

        healthGoals = healthGoalsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (err) {
        console.error("Error fetching health goals:", err);
      }

      // Check for approved consents
      const approvedConsentsList = await checkApprovedConsents(patient.id);
      setApprovedConsents(approvedConsentsList);

      setSelectedPatient({
        id: patient.id,
        ...data,
        reports: healthRecords,
        healthGoals: healthGoals,
      });

      setConsentSent(false);
      setPurpose("");
      setTimelineMinutes("");
    } else {
      setSelectedPatient(null);
      setConsentSent(false);
      setApprovedConsents([]);
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

  const handleToggleGoal = async (goalId, currentStatus) => {
    if (!hasApprovedConsent()) {
      alert("You need approved consent to update health goals.");
      return;
    }

    try {
      await updateDoc(
        doc(db, "patients", selectedPatient.id, "healthGoals", goalId),
        {
          done: !currentStatus,
        }
      );

      // Update local state
      setSelectedPatient(prev => ({
        ...prev,
        healthGoals: prev.healthGoals.map(goal =>
          goal.id === goalId ? { ...goal, done: !currentStatus } : goal
        )
      }));
    } catch (err) {
      console.error("Error updating health goal:", err);
      alert("Failed to update health goal.");
    }
  };

  const handleViewFile = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const hasApprovedConsent = () => {
    return approvedConsents.length > 0;
  };

  const getGoalStatusColor = (done) => {
    return done ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100";
  };

  const getGoalStatusIcon = (done) => {
    return done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  const formatGoalDate = (timestamp) => {
    if (!timestamp) return "No date";
    
    // Handle Firestore timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    
    // Handle regular date string
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen mt-20">
      <Navbar userType="doctor" />

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                    {selectedPatient.createdAt
                      ? new Date(selectedPatient.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Health Goals Summary */}
              {selectedPatient.healthGoals && selectedPatient.healthGoals.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Health Goals Summary</h4>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✅ {selectedPatient.healthGoals.filter(g => g.done).length} Completed
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      ⏳ {selectedPatient.healthGoals.filter(g => !g.done).length} Pending
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area with Tabs */}
            <div className="lg:col-span-2 bg-white border border-teal-200 rounded-lg p-6">
              {/* Tab Navigation */}
              <div className="flex mb-6 border-b">
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`flex items-center gap-2 px-4 py-2 font-medium ${
                    activeTab === "reports"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  📋 Medical Reports ({selectedPatient.reports.length})
                </button>
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`flex items-center gap-2 px-4 py-2 font-medium ${
                    activeTab === "goals"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Health Goals ({selectedPatient.healthGoals?.length || 0})
                </button>
              </div>

              {/* Consent Status */}
              {hasApprovedConsent() && (
                <div className="mb-4">
                  <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    ✅ Consent Approved - You can view and update patient data
                  </span>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div>
                  <h3 className="text-teal-800 text-lg font-semibold mb-4">
                    Medical Reports ({selectedPatient.reports.length})
                  </h3>

                  {selectedPatient.reports.length > 0 ? (
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
                              <td className="py-3 px-4">
                                {report.name || "-"}
                              </td>
                              <td className="py-3 px-4">
                                {report.type || "-"}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  {hasApprovedConsent() ? (
                                    <button
                                      onClick={() => handleViewFile(report.url)}
                                      className="flex items-center gap-1 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-50"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View
                                    </button>
                                  ) : (
                                    <button className="text-teal-700 border border-teal-200 px-2 py-1 rounded hover:bg-teal-50">
                                      Request Consent
                                    </button>
                                  )}
                                  {report.url && hasApprovedConsent() && (
                                    <a
                                      href={report.url}
                                      download
                                      className="text-blue-700 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                                    >
                                      Download
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No health records found for this patient.
                    </p>
                  )}
                </div>
              )}

              {/* Health Goals Tab */}
              {activeTab === "goals" && (
                <div>
                  <h3 className="text-teal-800 text-lg font-semibold mb-4">
                    Health Goals ({selectedPatient.healthGoals?.length || 0})
                  </h3>

                  {selectedPatient.healthGoals && selectedPatient.healthGoals.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPatient.healthGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className={`border rounded-lg p-4 ${
                            goal.done ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(goal.done)}`}>
                                  {getGoalStatusIcon(goal.done)}
                                  {goal.done ? "Completed" : "In Progress"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Created: {formatGoalDate(goal.createdAt)}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {goal.name}
                              </h4>
                              {goal.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {goal.description}
                                </p>
                              )}
                            </div>
                            
                            {hasApprovedConsent() && (
                              <button
                                onClick={() => handleToggleGoal(goal.id, goal.done)}
                                className={`ml-4 px-3 py-1 text-xs font-medium rounded transition-colors ${
                                  goal.done
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                }`}
                              >
                                {goal.done ? "Mark Incomplete" : "Mark Complete"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No health goals found for this patient.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Consent Request Form - Only show if no approved consent */}
              {doctorData && !hasApprovedConsent() && (
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
                        placeholder="e.g., Review medical records and update health goals"
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

              {/* Show approved consent info */}
              {hasApprovedConsent() && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-bold text-green-700 mb-4">
                    Consent Approved ✅
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      You have approved access to view, download medical records, and update health goals for this patient.
                    </p>
                    {approvedConsents.length > 0 && (
                      <div className="mt-2 text-xs text-green-700">
                        <p><strong>Purpose:</strong> {approvedConsents[0].purpose}</p>
                        <p><strong>Timeline:</strong> {approvedConsents[0].timelineMinutes} minutes</p>
                        <p><strong>Approved:</strong> {approvedConsents[0].timestamp ? new Date(approvedConsents[0].timestamp.seconds * 1000).toLocaleString() : 'Recently'}</p>
                      </div>
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