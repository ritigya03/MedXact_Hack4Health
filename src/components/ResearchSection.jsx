import React from "react";
import { User, Phone, MapPin, Users } from "lucide-react";

const ResearchSection = ({
  researchSharing,
  toggleResearchSharing,
  personalDetails,
  togglePersonalDetail
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
  
      <div className="space-y-4">
        {/* Research Data Sharing Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Research Data Sharing
          </span>
          <button
            onClick={toggleResearchSharing}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              researchSharing ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                researchSharing ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Show Personal Info section only if research sharing is ON */}
        {researchSharing && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Personal Information Visibility
            </h3>
            <div className="space-y-2">
              {[
                { key: "name", label: "Full Name", icon: User },
                { key: "contact", label: "Contact Info", icon: Phone },
                { key: "location", label: "Location", icon: MapPin },
                { key: "family", label: "Family History", icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                  <button
                    onClick={() => togglePersonalDetail(key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      personalDetails[key] ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        personalDetails[key]
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchSection;
