import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Patient pages
import Home from "./pages/Home";
import MedxactLanding from "./pages/MedxactLanding";
// import PatientDashboard from "./pages/Patient/Dashboard";
// import PatientProfile from "./pages/Patient/Profile";
// import Settings from "./pages/Patient/Settings";
// import ContactUs from "./pages/Patient/Contact";
// import Onboarding from "./pages/Patient/Onboarding";

// // Doctor pages
// import DoctorProfile from "./pages/Doctor/Profile";
// import DoctorOnboarding from "./pages/Doctor/Onboarding";
// import DoctorDashboard from "./pages/Doctor/Dashboard";

import './App.css';
import "./i18n";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home & Landing */}
        <Route path="/" element={<Home />} />
        <Route path="/landing-page" element={<MedxactLanding />} />

        {/* Patient Routes */}
        {/* <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/settings" element={<Settings />} />
        <Route path="/patient/contact" element={<ContactUs />} />
        <Route path="/onboarding" element={<Onboarding />} /> */}

        {/* Doctor Routes */}
        {/* <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
