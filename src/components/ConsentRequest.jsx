import React from "react";
import { Shield } from "lucide-react";

const ConsentRequests = ({ consentRequests, handleConsentResponse }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        Consent Requests
      </h2>

      {consentRequests.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No consent requests at the moment.
        </p>
      ) : (
        <div className="space-y-5">
          {consentRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 space-y-3 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {request.requester}
                </h3>
                <p className="text-sm text-gray-500">{request.clinic}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Requested Data:</span>{" "}
                  {request.dataRequested}
                </p>
              </div>

              <div className="text-sm">
                <span className="font-medium text-gray-700">AI Verdict:</span>{" "}
                <span className="text-blue-700 font-semibold capitalize">
                  {request.aiVerdict || "Unverified"}{" "}
                  {request.confidenceScore && (
                    <span className="text-gray-500">
                      ({Math.round(request.confidenceScore)}%)
                    </span>
                  )}
                </span>
              </div>

              {request.status === "pending" ? (
                <div className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0">
                  <button
                    onClick={() => handleConsentResponse(request.id, "approved")}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleConsentResponse(request.id, "denied")}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm"
                  >
                    ❌ Deny
                  </button>
                  <button
                    onClick={() =>
                      alert(`Reason: ${request.reason || "No reason provided"}`)
                    }
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 text-sm"
                  >
                    🔍 Review
                  </button>
                </div>
              ) : (
                <div
                  className={`text-sm font-medium ${
                    request.status === "approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {request.status === "approved" ? "✓ Approved" : "✗ Denied"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsentRequests;
