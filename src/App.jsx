import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Patient pages
import Home from "./pages/Home";
import MedxactLanding from "./pages/MedxactLanding";
import PatientDashboard from "./pages/Patient/Dashboard";
import PatientProfile from "./pages/Patient/Profile";
import Vaccine from "./pages/Patient/Vaccine";
import ContactUs from "./pages/Patient/Contact";
import Onboarding from "./pages/Patient/Onboarding";

// Doctor pages
import DoctorProfile from "./pages/Doctor/Profile";
import DoctorOnboarding from "./pages/Doctor/Onboarding";
import DoctorDashboard from "./pages/Doctor/Dashboard";
import DoctorAppointments from "./pages/Doctor/appointment";
import ChatbotWidget from "./components/ChatbotWidget";

import './App.css';
import "./i18n";

function App() {
  return (
    <Router>
      {/* Global Chatbot Widget */}
      <ChatbotWidget />

      <Routes>
        {/* Redirect root path to landing page */}
        <Route path="/" element={<Navigate to="/landing-page" replace />} />
        
        {/* Landing Page */}
        <Route path="/landing-page" element={<MedxactLanding />} />
        
        {/* Home Page (now accessible via /home) */}
        <Route path="/home" element={<Home />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/Vaccine" element={<Vaccine />} />
        <Route path="/patient/contact" element={<ContactUs />} />

        <Route path="/onboarding" element={<Onboarding />} />

        {/* Doctor Routes */}
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        {/* <Route path="/doctor/appointments" element={<DoctorAppointments />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
