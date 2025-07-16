import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, Eye, Trash2, Heart, Shield,
   X, Image as ImageIcon, AlertCircle, CheckCircle, Clock, Brain, Zap, BarChart3, FileStack, TrendingUp,HeartPulse,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ResearchSection from "../../components/ResearchSection";
import ConsentRequests from "../../components/ConsentRequest";
import PDFViewer from '../../components/PDFViewer';
import ImageViewer from '../../components/ImageViewer';
import Navbar from '../../components/Navbar';
import ChatbotWidget from '../../components/ChatbotWidget';
import HealthGoals from "../../components/HealthGoals";
import { auth, db } from '../../firebase';
import { 
  doc, onSnapshot, updateDoc, collection, getDoc, deleteDoc, 
  setDoc, getDocs 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// Import blockchain utilities
import { getContract } from "../../utils/medxactContract";
import { ethers } from "ethers";
import { nanoid } from "nanoid";

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const hashFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const getFileIcon = (type) => {
  if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-gray-500" />;
};

const formatFileSize = (size) => {
  if (!size) return 'Unknown';
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const getStatusIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Clock className="w-5 h-5 text-blue-500" />;
  }
};

const PatientDashboard = () => {
  // const [patientName, setPatientName] = useState("Patient");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [consentRequests, setConsentRequests] = useState([]);
  const [researchSharing, setResearchSharing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({ 
    name: false, contact: false, location: false, family: false 
  });

  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [overallInsights, setOverallInsights] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [generatingOverall, setGeneratingOverall] = useState(false);
  const [insightView, setInsightView] = useState('overall'); // 'overall' or 'individual'
  const [generatingAdvice, setGeneratingAdvice] = useState(false);
  const [preventiveAdvice, setPreventiveAdvice] = useState([]);
  const [overallPreventiveAdvice, setOverallPreventiveAdvice] = useState("");
  const [adviceView, setAdviceView] = useState("overall");

  // PDF text extraction function
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => item.str || "")
            .filter((text) => text.trim().length > 0)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
          fullText += `${pageText} `;
        } catch (pageError) {
          console.error(`Error extracting text from page ${pageNum}:`, pageError);
        }
      }
      return fullText.trim();
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return null;
    }
  };

  //generate preventive insights
  const generateOverallPreventiveAdvice = async () => {
  try {
    setGeneratingAdvice(true);
    setUploadStatus({
      type: "info",
      message: "Generating overall preventive advice...",
    });

    const res = await fetch("http://localhost:4000/api/preventive-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: reportHistory.join("\n\n"), // combine all reports into one block
      }),
    });

    const data = await res.json();
    console.log("🌿 Overall Preventive Advice Response:", data);

    if (typeof data?.preventiveAdvice === "string") {
      setOverallPreventiveAdvice(data.preventiveAdvice);

      setUploadStatus({
        type: "success",
        message: "Overall preventive advice generated successfully!",
      });
    } else {
      setUploadStatus({
        type: "warning",
        message: "AI overall preventive advice could not be generated",
      });
    }
  } catch (error) {
    console.error("Error generating overall preventive advice:", error);
    setUploadStatus({
      type: "error",
      message: "Failed to generate overall preventive advice",
    });
  } finally {
    setGeneratingAdvice(false);
  }
};

const generatePreventiveAdvice = async (text, fileName) => {
  try {
    setGeneratingAdvice(true);
    setUploadStatus({
      type: "info",
      message: "Generating AI preventive advice...",
    });

    const res = await fetch("http://localhost:4000/api/preventive-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        reportHistory, // if you want to send previous reports
      }),
    });

    const data = await res.json();
    console.log("🌿 Preventive Advice Response:", data);

    if (typeof data?.preventiveAdvice === "string") {
      const adviceSections = data.preventiveAdvice
        .split(/\n+/)
        .filter(Boolean);
      const timestamp = new Date().toISOString();

      const adviceObj = {
        id: nanoid(),
        fileName,
        adviceSections,
        timestamp,
        text: text.substring(0, 200) + "...", // preview
      };

      setPreventiveAdvice((prev) => [adviceObj, ...prev]);

      setUploadStatus({
        type: "success",
        message: "Preventive advice generated successfully!",
      });
    } else {
      setUploadStatus({
        type: "warning",
        message: "AI preventive advice could not be generated",
      });
    }
  } catch (error) {
    console.error("Error generating preventive advice:", error);
    setUploadStatus({
      type: "error",
      message: "Failed to generate preventive advice",
    });
  } finally {
    setGeneratingAdvice(false);
  }
};

  // Generate AI insights function for individual files
  const generateInsights = async (text, fileName) => {
    try {
      setGeneratingInsights(true);
      setUploadStatus({ type: "info", message: "Generating AI insights..." });

      const res = await fetch("http://localhost:4000/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          fileName,
        }),
      });

      const data = await res.json();
      console.log("🔍 AI Insights Response:", data);

      if (typeof data?.summary === "string") {
        const insights = data.summary.split(/\n+/).filter(Boolean);
        const timestamp = new Date().toISOString();
        
        // Create insight object with metadata
        const insightObj = {
          id: nanoid(),
          fileName,
          insights,
          timestamp,
          text: text.substring(0, 200) + "..." // Store preview
        };

        setAiInsights(prevInsights => [insightObj, ...prevInsights]);
        
        // Add to report history for overall analysis
        setReportHistory(prev => [text, ...prev]);
        
        setUploadStatus({ type: "success", message: "AI insights generated successfully!" });
      } else {
        setUploadStatus({ type: "warning", message: "AI insights could not be generated" });
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
      setUploadStatus({ type: "error", message: "Failed to generate AI insights" });
    } finally {
      setGeneratingInsights(false);
    }
  };

  // Generate overall insights from all reports
  const generateOverallInsights = async () => {
    if (reportHistory.length === 0) {
      setUploadStatus({ type: "warning", message: "No reports available for overall analysis" });
      return;
    }

    try {
      setGeneratingOverall(true);
      setUploadStatus({ type: "info", message: "Generating overall health insights..." });

      const res = await fetch("http://localhost:4000/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: reportHistory[0], // Latest report
          reportHistory: reportHistory.slice(1), // Previous reports
        }),
      });

      const data = await res.json();
      console.log("🔍 Overall Insights Response:", data);

      if (typeof data?.summary === "string") {
        setOverallInsights({
          id: nanoid(),
          summary: data.summary,
          timestamp: new Date().toISOString(),
          reportCount: reportHistory.length
        });
        
        setUploadStatus({ type: "success", message: "Overall insights generated successfully!" });
      } else {
        setUploadStatus({ type: "warning", message: "Overall insights could not be generated" });
      }
    } catch (error) {
      console.error("Error generating overall insights:", error);
      setUploadStatus({ type: "error", message: "Failed to generate overall insights" });
    } finally {
      setGeneratingOverall(false);
    }
  };

  // Load files and insights from Firestore on mount
  useEffect(() => {
    const fetchHealthRecords = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const recordsRef = collection(db, "patients", user.uid, "healthRecords");
        const querySnapshot = await getDocs(recordsRef);
        const files = [];
        const history = [];
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          files.push(data);
          if (data.extractedText) {
            history.push(data.extractedText);
          }
        });
        
        setUploadedFiles(files);
        setReportHistory(history);

        // Load existing insights
        const insightsRef = collection(db, "patients", user.uid, "insights");
        const insightsSnapshot = await getDocs(insightsRef);
        const insights = [];
        
        insightsSnapshot.forEach((docSnap) => {
          insights.push(docSnap.data());
        });
        
        setAiInsights(insights);
      } catch (err) {
        console.error("Error fetching health records:", err);
      }
    };

    fetchHealthRecords();
  }, []);

  // Auto-generate overall insights when report history changes
  useEffect(() => {
    if (reportHistory.length > 1 && !overallInsights) {
      generateOverallInsights();
    }
  }, [reportHistory.length]);

  // Recompute hashes for existing files without hash
  useEffect(() => {
    const hashStaticFiles = async () => {
      const filesWithHash = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (!file.hash && file.url) {
            try {
              const response = await fetch(file.url);
              const blob = await response.blob();
              const hash = await hashFile(blob);
              return { ...file, hash };
            } catch (error) {
              console.error("Error hashing file:", error);
              return { ...file, hash: "Unavailable" };
            }
          }
          return file;
        })
      );
      setUploadedFiles(filesWithHash);
    };

    if (uploadedFiles.length > 0) {
      hashStaticFiles();
    }
  }, [uploadedFiles.length]);
  // Consent requests listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const consentRef = collection(db, "patients", user.uid, "consentRequests");
      
      onSnapshot(consentRef, async (querySnapshot) => {
        const requests = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const consentData = docSnap.data();
            let doctorName = "Unknown";
            let clinic = "Not specified";
            let licenseNumber = "UNKNOWN";
            let specialization = "General";

            if (consentData.doctorId) {
              const doctorRef = doc(db, "doctors", consentData.doctorId);
              const doctorSnap = await getDoc(doctorRef);
              if (doctorSnap.exists()) {
                const doctor = doctorSnap.data();
                doctorName = doctor.fullName || "Unknown";
                clinic = doctor.clinic || "Not specified";
                specialization = doctor.specialization || "General";
                licenseNumber = doctor.licenseNumber || "UNKNOWN";
              }

              try {
                const res = await fetch("http://localhost:4000/analyze", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    doctor: { fullName: doctorName, licenseNumber, specialization, associatedClinic: clinic },
                    patient: { fullName: user.displayName || "Unknown", email: user.email || "Unknown" },
                    requestDetails: consentData.purpose || "General Info"
                  })
                });
                const verdict = await res.json();
                return {
                  id: docSnap.id,
                  requester: doctorName,
                  clinic,
                  dataRequested: consentData.purpose || "General Info",
                  status: consentData.status || "pending",
                  aiVerdict: verdict.status,
                  confidenceScore: verdict.confidence,
                  reason: verdict.reason
                };
              } catch {
                return {
                  id: docSnap.id,
                  requester: doctorName,
                  clinic,
                  dataRequested: consentData.purpose || "General Info",
                  status: consentData.status || "pending",
                  aiVerdict: "Unverified",
                  confidenceScore: null,
                  reason: "Unable to fetch AI verdict"
                };
              }
            }

            return {
              id: docSnap.id,
              requester: doctorName,
              clinic,
              dataRequested: consentData.purpose || "General Info",
              status: consentData.status || "pending",
              aiVerdict: "Unverified",
              confidenceScore: null,
              reason: "Doctor info not found"
            };
          })
        );
        setConsentRequests(requests);
      });
    });
    return () => unsubscribe();
  }, []);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      setUploadStatus({ type: "info", message: "Processing file..." });

      // Validate file type
      const allowedTypes = [
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload PDF");
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 10MB.");
      }

      const fileURL = URL.createObjectURL(file);
      const hashHex = await hashFile(file);
      const hashBytes32 = ethers.zeroPadBytes("0x" + hashHex, 32);

      // Extract text if PDF and generate AI insights
      let extractedText = null;
      if (file.type === "application/pdf") {
        setUploadStatus({ type: "info", message: "Extracting text from PDF..." });
        extractedText = await extractTextFromPDF(file);
      }

      setUploadStatus({ type: "info", message: "Storing on blockchain..." });

      // Store on blockchain
      // try {
      //   const contract = await getContract();
      //   const patientId = auth.currentUser?.uid || "PATIENT-123";

      //   const tx = await contract.storeDocumentHash(patientId, hashBytes32);
      //   await tx.wait();

      //   setUploadStatus({ type: "success", message: "Document hash stored on blockchain!" });
      // } catch (err) {
      //   console.error("Blockchain storage failed:", err);
      //   setUploadStatus({ type: "warning", message: "Blockchain storage failed, saving locally..." });
      // }

      // Create file object
      const newFile = {
        id: nanoid(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileURL,
        hash: hashHex,
        uploadedAt: new Date().toISOString(),
        verified: false,
        extractedText: extractedText || null,
      };

      // Save to Firestore
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "patients", user.uid, "healthRecords", newFile.id);
        await setDoc(docRef, newFile);
      }

      // Update local state
      setUploadedFiles((prev) => [...prev, newFile]);
      setUploadStatus({ type: "success", message: "File uploaded successfully!" });

      // Generate AI insights if text was extracted
      if (extractedText && extractedText.trim().length > 0) {
        await generateInsights(extractedText, file.name);
      }

      // Clear status after 5 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);

    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({ type: "error", message: error.message });
    } finally {
      setUploadProgress(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      // Remove from Firestore
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, "patients", user.uid, "healthRecords", fileId));
      }

      // Clean up blob URL
      const fileToDelete = uploadedFiles.find(file => file.id === fileId);
      if (fileToDelete?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(fileToDelete.url);
      }

      // Remove from report history
      if (fileToDelete?.extractedText) {
        setReportHistory(prev => prev.filter(text => text !== fileToDelete.extractedText));
      }

      // Update local state
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      
      // Close viewer if viewing deleted file
      if (viewingFile?.id === fileId) {
        setViewingFile(null);
      }

      setUploadStatus({ type: "success", message: "File deleted successfully!" });

      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setUploadStatus({ type: "error", message: "Failed to delete file" });
    }
  };
  const handleConsentResponse = async (id, decision) => {
      try {
        const user = auth.currentUser;
        if (!user) return;
  
        const consentRef = doc(db, "patients", user.uid, "consentRequests", id);
        
        if (decision === "denied") {
          await deleteDoc(consentRef);
          setConsentRequests(prev => prev.filter(req => req.id !== id));
        } else {
          await updateDoc(consentRef, { 
            status: decision,
            respondedAt: new Date().toISOString()
          });
          setConsentRequests(prev => prev.map(req => 
            req.id === id ? { ...req, status: decision } : req
          ));
        }
  
        setUploadStatus({ 
          type: "success", 
          message: `Consent request ${decision === "approved" ? "approved" : "denied"}` 
        });
  
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      } catch (error) {
        console.error("Consent response error:", error);
        setUploadStatus({ type: "error", message: "Failed to respond to consent request" });
      }
    };
 const togglePersonalDetail = (key) => {
    setPersonalDetails(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Function to manually generate insights for existing files
  const generateInsightsForFile = async (file) => {
    if (!file.extractedText && file.type === "application/pdf") {
      try {
        setGeneratingInsights(true);
        setUploadStatus({ type: "info", message: "Extracting text and generating insights..." });
        
        const response = await fetch(file.url);
        const blob = await response.blob();
        const extractedText = await extractTextFromPDF(blob);
        
        if (extractedText) {
          await generateInsights(extractedText, file.name);
        } else {
          setUploadStatus({ type: "warning", message: "Could not extract text from PDF" });
        }
      } catch (error) {
        console.error("Error generating insights:", error);
        setUploadStatus({ type: "error", message: "Failed to generate insights" });
      } finally {
        setGeneratingInsights(false);
      }
    } else if (file.extractedText) {
      await generateInsights(file.extractedText, file.name);
    }
  };
  function highlightKeywords(text) {
    const regex = /\b(high|low|critical|abnormal|\d+\.?\d*)\b/gi;
    return text.split(regex).map((part, index) => {
      if (regex.test(part)) {
        return (
          <strong key={index} className="text-red-900 font-extrabold">
            {part}
          </strong>
        );
      } else {
        return part;
      }
    });
  }
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-screen mt-10 mx-auto px-20 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mt-5 font-bold text-gray-900 mb-2">
            Patient Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your health records and get AI-powered insights
          </p>
        </div>

        {/* Status Messages */}
        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-2 ${
            uploadStatus.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800"
              : uploadStatus.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : uploadStatus.type === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            {getStatusIcon(uploadStatus.type)}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Upload & Records */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Health Records
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Upload PDFs, images, or documents (max 10MB)
                </p>
                <p className="text-sm text-blue-600 mb-4">
                  📋 PDFs will be automatically analyzed for AI insights
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                  disabled={uploadProgress}
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
                    uploadProgress
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {uploadProgress ? "Processing..." : "Choose File"}
                </label>
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Your Health Records</h2>
              
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No files uploaded yet. Start by uploading your first health record.
                </p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                          {file.hash && (
                            <p className="text-xs text-gray-400 font-mono">
                              Hash: {file.hash.substring(0, 16)}...
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.type === "application/pdf" && (
                          <button
                            onClick={() => generateInsightsForFile(file)}
                            disabled={generatingInsights}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg disabled:opacity-50"
                            title="Generate AI Insights"
                          >
                            <Brain className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setViewingFile(file)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* consent */}
            <ConsentRequests
              consentRequests={consentRequests}
              handleConsentResponse={handleConsentResponse}
            />
            {/* Health Goals */}
            <HealthGoals />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
                  {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Settings
              </h2>
              
              <ResearchSection
                researchSharing={researchSharing}
                toggleResearchSharing={() => setResearchSharing(!researchSharing)}
                personalDetails={personalDetails}
                togglePersonalDetail={togglePersonalDetail}
              />
            </div>

            {/* ai insights */}
<div className="bg-white rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          AI Health Insights
          {(generatingInsights || generatingOverall) && (
            <div className="ml-2 animate-spin">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
          )}
        </h2>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setInsightView('overall')}
            className={`px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
              insightView === 'overall'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-1" />
            Overall
          </button>
          <button
            onClick={() => setInsightView('individual')}
            className={`px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
              insightView === 'individual'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <FileStack className="w-4 h-4 inline mr-1" />
            Individual
          </button>
        </div>
      </div>

      {/* Warnings Box */}
      {overallInsights?.warnings?.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded">
          <h3 className="text-red-800 font-bold mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            Warnings & Alerts
          </h3>
          <ul className="space-y-2 text-sm text-red-700">
            {overallInsights.warnings.map((warn, i) => (
              <li key={i} className="leading-relaxed">
                {highlightKeywords(warn)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall Insights View */}
      {insightView === 'overall' && (
        <div className="space-y-4 h-[400px] overflow-y-auto">
          {reportHistory.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {reportHistory.length} report(s) in history
                </span>
              </div>
              <button
                onClick={generateOverallInsights}
                disabled={generatingOverall}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {generatingOverall ? 'Analyzing...' : 'Refresh Analysis'}
              </button>
            </div>
          )}

          {overallInsights ? (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-purple-800">
                  Overall Health Analysis
                </h3>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {overallInsights.reportCount} reports
                </span>
              </div>
              <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                {overallInsights.summary}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Generated:{' '}
                {new Date(overallInsights.timestamp).toLocaleString()}
              </div>
            </div>
          ) : reportHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileStack className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Upload health reports to get overall insights</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-pulse">
                <Brain className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Generating overall health insights...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Individual Insights View */}
      {insightView === 'individual' && (
        <div className="space-y-3 h-[400px] overflow-y-auto">
          {aiInsights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No individual insights yet</p>
              <p className="text-sm">Upload PDF reports to get AI analysis</p>
            </div>
          ) : (
            aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="border rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-gray-700">
                      {insight.fileName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(insight.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {insight.insights.map((text, index) => (
                    <p
                      key={index}
                      className="text-base text-gray-800 leading-relaxed p-2 bg-purple-50 rounded font-medium"
                    >
                      {highlightKeywords(text)}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>

    {/* preventive insights */}
    <div className="bg-white rounded-xl shadow-sm p-4 mt-8">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold flex items-center">
      <HeartPulse className="w-5 h-5 mr-2 text-green-600" />
      AI Preventive Advice
      {generatingAdvice && (
        <div className="ml-2 animate-spin">
          <Zap className="w-4 h-4 text-green-600" />
        </div>
      )}
    </h2>

    {/* View Toggle */}
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setAdviceView("overall")}
        className={`px-2.5 py-1 rounded-md text-sm font-medium transition-colors ${
          adviceView === "overall"
            ? "bg-white text-green-600 shadow-sm"
            : "text-gray-600 hover:text-green-600"
        }`}
      >
        <Layers className="w-4 h-4 inline mr-1" />
        Overall
      </button>
  
    </div>
  </div>

  {/* Overall Advice View */}
  {adviceView === "overall" && (
    <div className="space-y-4 h-[400px] overflow-y-auto">
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            Overall preventive guidance for your reports
          </span>
        </div>
        <button
          onClick={generateOverallPreventiveAdvice}
          disabled={generatingAdvice}
          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {generatingAdvice ? "Analyzing..." : "Refresh Advice"}
        </button>
      </div>

      {overallPreventiveAdvice ? (
        <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-3">
            <HeartPulse className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800">
              Overall Preventive Health Plan
            </h3>
          </div>
          <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
            {overallPreventiveAdvice}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Generated: {new Date().toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {generatingAdvice ? (
            <div className="animate-pulse">
              <HeartPulse className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Generating overall preventive advice...</p>
            </div>
          ) : (
            <>
              <FileStack className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Upload health reports to generate preventive advice.</p>
            </>
          )}
        </div>
      )}
    </div>
  )}

 
</div>

          </div>
        </div>
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{viewingFile.name}</h3>
              <button
                onClick={() => setViewingFile(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              {viewingFile.type.includes("pdf") ? (
                <PDFViewer file={viewingFile} />
              ) : viewingFile.type.includes("image") ? (
                <ImageViewer file={viewingFile} />
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Preview not available for this file type
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default PatientDashboard;