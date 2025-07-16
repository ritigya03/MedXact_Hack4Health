"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Shield,
  Bot,
  CheckCircle,
  MessageSquare,
  QrCode,
  Share2,
  Star,
  Mail,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  X,
} from "lucide-react";

export default function MedxactLanding() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      icon: Bot,
      title: "Health Tracker",
      description:
        "Monitors your vitals,medication and health trends at real time analysis.",
    },
    {
      icon: Bot,
      title: "AI Health Insights",
      description:
        "Personalized health recommendations in simple language.",
    },
    {
      icon: CheckCircle,
      title: "Smart Consent",
      description:
        "AI-powered privacy protection for your sensitive data.",
    },
    {
      icon: MessageSquare,
      title: "Secure Communication",
      description:
        "Encrypted doctor-to-doctor collaboration platform.",
    },
    {
      icon: QrCode,
      title: "Emergency Access",
      description:
        "Instant critical information sharing, even offline.",
    },
    {
      icon: Share2,
      title: "Anonymous Research",
      description:
        "Contribute to medical breakthroughs while staying private.",
    },
  ];

  const reviews = [
    {
      name: "Rina Sharma",
      role: "Patient",
      review:
        "It transformed my diabetes management. Everything is seamlessly accessible.",
      rating: 5,
    },
    {
      name: "Dr. Ahuja",
      role: "Medical Professional",
      review:
        "The secure collaboration features save hours and improve patient outcomes.",
      rating: 5,
    },
    {
      name: "S.K.",
      role: "Privacy Advocate",
      review:
        "Finally, a platform that truly respects patient privacy and data control.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Sidebar omitted for brevity */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-br from-white via-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-600 bg-clip-text text-transparent">
            Your Health,
            <br />
            Your Control
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light mb-12 leading-relaxed">
            Manage and share your medical records securely.
            <br />
            <span className="text-gray-400">
              Blockchain-backed • Privacy-first • AI-enabled
            </span>
          </p>
          <div className="flex flex-col items-center gap-4 justify-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg font-medium">
                Access My Health Data
              </button>
              <button className="text-gray-700 px-8 py-4 rounded-full border border-gray-300 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                Explore MEDXACT
              </button>
            </div>
            
            {/* NEW: Highlighted Get Started Button */}
            <a 
              href="/home" 
              className="mt-4 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 border-2 border-blue-700 shadow-lg animate-pulse"
            >
              Get Started Now →
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transforming Healthcare Data
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed">
              MEDXACT empowers patients with complete control over their health
              records through cutting-edge technology and privacy-first design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Storage",
                desc: "Blockchain-verified medical records.",
              },
              {
                icon: Bot,
                title: "AI Insights",
                desc: "Personalized health recommendations.",
              },
              {
                icon: CheckCircle,
                title: "Privacy Control",
                desc: "You decide who sees your data.",
              },
              {
                icon: Share2,
                title: "Research Impact",
                desc: "Anonymous contribution to science.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-emerald-50 shadow-inner rounded-2xl mb-6 group-hover:shadow-lg transition-all duration-300">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Everything you need for modern healthcare management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl mr-4 group-hover:shadow-md transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-500 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-500 font-light">
              See what our users have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mb-6 border border-gray-100">
                  <div className="flex justify-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic font-light leading-relaxed mb-6">
                    "{review.review}"
                  </p>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {review.name}
                </h4>
                <p className="text-gray-500">{review.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Take Control of Your Health Data?
          </h2>
          <p className="text-xl mb-8 opacity-90 font-light">
            Join patients and healthcare professionals building a privacy-first
            healthcare future with MEDXACT.
          </p>
          <button className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300">
            Access MEDXACT Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-emerald-500 bg-clip-text text-transparent mb-4">
              MEDXACT
            </h3>
            <p className="text-gray-500 font-light">
              Empowering patients through secure, intelligent healthcare
              technology.
            </p>
          </div>
          <div className="border-t border-gray-100 pt-8">
            <p className="text-gray-400 text-sm">
              &copy; 2025 MEDXACT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}