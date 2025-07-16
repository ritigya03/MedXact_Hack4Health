// src/pages/Home.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userType, setUserType] = useState("patient");
  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const navigate = useNavigate();

  const handleLoginClick = (type) => {
    setUserType(type);
    setShowLoginForm(true);
  };

  const handleCloseForm = () => {
    setShowLoginForm(false);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;

      const doctorRef = doc(db, "doctors", user.uid);
      const patientRef = doc(db, "patients", user.uid);

      const [doctorSnap, patientSnap] = await Promise.all([
        getDoc(doctorRef),
        getDoc(patientRef),
      ]);

      if (doctorSnap.exists()) {
        const doctorData = doctorSnap.data();
        const isOnboarded = !!doctorData.specialization;
        navigate(isOnboarded ? "/doctor/profile" : "/doctor/onboarding");
        return;
      }

      if (patientSnap.exists()) {
        const patientData = patientSnap.data();
        const isOnboarded = !!patientData.age;
        navigate(isOnboarded ? "/patient/profile" : "/onboarding");
        return;
      }

      alert("User role not found in database.");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleSignup = async () => {
    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );

      const user = userCredential.user;
      const collection = userType === "doctor" ? "doctors" : "patients";

      await setDoc(doc(db, collection, user.uid), {
        fullName,
        email: signupEmail,
        userType,
        licenseNumber: userType === "doctor" ? licenseNumber : "",
        createdAt: new Date().toISOString(),
      });

      setShowLoginForm(false);

      if (userType === "patient") {
        navigate("/onboarding");
      } else {
        navigate("/doctor/onboarding");
      }
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(to bottom right, #f0fdfa, #ecfeff, #ecfdf5)" }}>
      {/* Background */}
      <div className="absolute inset-0" style={{ opacity: 0.1, pointerEvents: "none" }}>
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ backgroundColor: "#5eead4", filter: "blur(80px)", mixBlendMode: "multiply", animation: "pulse 2s infinite" }} />
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full" style={{ backgroundColor: "#67e8f9", filter: "blur(80px)", mixBlendMode: "multiply", animation: "pulse 2s infinite 1s" }} />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 rounded-full" style={{ backgroundColor: "#34d399", filter: "blur(80px)", mixBlendMode: "multiply", animation: "pulse 2s infinite 2s", transform: "translateX(-50%)" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl shadow-lg" style={{ background: "linear-gradient(to right, #0d9488, #06b6d4)" }}>
              <span style={{ fontSize: "48px", color: "white" }} role="img">🩺</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ background: "linear-gradient(to right, #0d9488, #06b6d4, #10b981)", WebkitBackgroundClip: "text", color: "transparent" }}>
            MedXact
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">AI-Powered Health Platform</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <button onClick={() => handleLoginClick("patient")} className="text-lg p-5 font-semibold text-white shadow-lg hover:shadow-xl transition transform hover:scale-105" style={{ background: "linear-gradient(to right, #0d9488, #06b6d4)", borderRadius: "8px" }}>
            Login as Patient
          </button>
          <button onClick={() => handleLoginClick("doctor")} className="p-5 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition transform hover:scale-105" style={{ background: "linear-gradient(to right, #06b6d4, #10b981)", borderRadius: "8px" }}>
            Login as Doctor/Hospital
          </button>
        </div>
      </div>

      {/* Sliding Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out" style={{ transform: showLoginForm ? "translateX(0)" : "translateX(100%)" }}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{userType === "patient" ? "Patient Portal" : "Healthcare Provider Portal"}</h2>
            <button onClick={handleCloseForm} style={{ fontSize: "24px", background: "none", border: "none" }}>✖️</button>
          </div>

          {/* Auth Tabs */}
          <div className="grid grid-cols-2 mb-4">
            <button className={`py-2 border-b-2 font-semibold ${activeTab === "login" ? "border-teal-600 text-teal-600" : "border-gray-300 text-gray-500"}`} onClick={() => setActiveTab("login")}>Login</button>
            <button className={`py-2 border-b-2 font-semibold ${activeTab === "signup" ? "border-teal-600 text-teal-600" : "border-gray-300 text-gray-500"}`} onClick={() => setActiveTab("signup")}>Sign Up</button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Enter your email" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter your password" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <button onClick={handleLogin} className="w-full py-2 text-white rounded" style={{ background: "linear-gradient(to right, #0d9488, #06b6d4)" }}>
                Login
              </button>
            </div>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Enter your email" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Create a password" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div className="space-y-2">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full border border-gray-300 p-2 rounded" />
              </div>
              {userType === "doctor" && (
                <div className="space-y-2">
                  <label>License Number</label>
                  <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Enter license number" className="w-full border border-gray-300 p-2 rounded" />
                </div>
              )}
              <button onClick={handleSignup} className="w-full py-2 text-white rounded" style={{ background: "linear-gradient(to right, #0d9488, #06b6d4)" }}>
                Sign Up
              </button>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-8 p-4 rounded-lg" style={{ background: "linear-gradient(to right, #f0fdfa, #ecfeff)" }}>
            <h3 className="font-semibold text-gray-800 mb-2">{userType === "patient" ? "Patient Benefits:" : "Healthcare Provider Benefits:"}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {userType === "patient" ? (
                <>
                  <li>• Secure health record management</li>
                  <li>• AI-powered health insights</li>
                  <li>• Easy appointment scheduling</li>
                  <li>• Telemedicine consultations</li>
                </>
              ) : (
                <>
                  <li>• Patient management system</li>
                  <li>• AI diagnostic assistance</li>
                  <li>• Secure data sharing</li>
                  <li>• Analytics and reporting</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Dark overlay */}
      {showLoginForm && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={handleCloseForm}></div>
      )}
    </div>
  );
}