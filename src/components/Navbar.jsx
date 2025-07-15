"use client";

import { useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ userType = "patient" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { label: "Dashboard", path: "dashboard" },
    { label: "Profile", path: "profile" },
    { label: "Settings", path: "settings" },
    { label: "Contact", path: "contact" },
  ];

  // compute the correct prefix
  const basePath = userType === "patient" ? "/patient" : "/doctor";

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            MEDXACT
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={`${basePath}/${link.path}`}
              className="block text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 font-medium"
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                MEDXACT
              </h1>
              <div className="hidden lg:flex space-x-8 ml-12">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={`${basePath}/${link.path}`}
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <button className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
              <span>AI</span>
              {/* <ArrowRight className="h-4 w-4" /> */}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
