"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  FileText,
  Copy,
  Check,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Setup worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [showText, setShowText] = useState(false);
  const [extractingText, setExtractingText] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [healthInsights, setHealthInsights] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setExtractedText("");
      setShowText(false);
      setError(null);
      setHealthInsights([]);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const generateInsights = async (text, fileName) => {
  try {
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
    console.log("🔍 Response from backend:", data);

    if (typeof data?.summary === "string") {
      const lines = data.summary.split(/\n+/).filter(Boolean);
      setHealthInsights(lines);
    } else {
      setHealthInsights(["No insights received."]);
    }
  } catch (error) {
    console.error("Error fetching insights:", error);
    setHealthInsights(["Failed to generate AI insights."]);
  }
};

  const extractTextFromPDF = async () => {
    if (!pdfUrl) {
      setError("No PDF file available");
      return;
    }

    setExtractingText(true);
    setError(null);
    setExtractedText("");
    setHealthInsights([]);

    try {
      const loadingTask = pdfjs.getDocument(pdfUrl);
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

          fullText += `=== PAGE ${pageNum} ===\n${pageText || "[No text found]"}\n\n`;
        } catch (pageError) {
          fullText += `=== PAGE ${pageNum} ===\n[Error extracting text]\n\n`;
        }
      }

      if (fullText.trim()) {
        setExtractedText(fullText);
        setShowText(true);
        await generateInsights(fullText);
      } else {
        setError("No text found in PDF. This might be a scanned document.");
      }
    } catch (err) {
      setError(`Text extraction failed: ${err.message}`);
    } finally {
      setExtractingText(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy text");
    }
  };

  if (!selectedFile) {
    return (
      <div className="bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">PDF Text Extractor</h1>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-center file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-600 mt-3">Select a PDF file to view and extract text</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-t-lg p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedFile.name}</h2>
              <p className="text-sm text-gray-600">📄 {numPages || 0} pages</p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPdfUrl(null);
                setExtractedText("");
                setShowText(false);
                setHealthInsights([]);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Choose Different File
            </button>
          </div>
        </div>

        <div className="bg-green-100 border-4 p-6 text-center">
          <button
            onClick={extractTextFromPDF}
            disabled={extractingText || !pdfUrl}
            className="bg-teal-800 hover:bg-teal-900 disabled:bg-gray-400 text-white font-bold py-6 px-12 rounded-xl text-xl shadow-2xl transform hover:scale-105 transition-all duration-200 "
          >
            <div className="flex items-center justify-center space-x-4">
              <FileText className="w-8 h-8" />
              <span>{extractingText ? "EXTRACTING TEXT..." : "EXTRACT TEXT FROM PDF"}</span>
            </div>
          </button>

          <div className="mt-4 text-lg font-semibold">
            {!showText && !extractingText && (
              <p className="text-gray-800">👆 Click above to extract all text from your PDF</p>
            )}
            {extractingText && <p className="text-blue-700 animate-pulse">⏳ Processing... Please wait</p>}
            {showText && <p className="text-green-700">✅ Text extracted successfully!</p>}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 p-4 rounded flex items-center text-red-700 text-lg mt-4">
            <AlertCircle className="w-6 h-6 mr-3" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700 text-2xl">
              ×
            </button>
          </div>
        )}

        <div className="bg-white rounded-b-lg overflow-hidden mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* PDF Viewer */}
            <div className="p-6 border-r">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">PDF Preview</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} className="p-2 bg-gray-200 rounded">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm px-3 py-1 bg-gray-100 rounded">{Math.round(scale * 100)}%</span>
                  <button onClick={() => setScale((s) => Math.min(3.0, s + 0.2))} className="p-2 bg-gray-200 rounded">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border rounded-lg overflow-auto max-h-[500px] bg-gray-50">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={() => setError("Failed to load PDF")}
                  loading={<div className="p-8 text-center">Loading PDF...</div>}
                >
                  <div className="flex justify-center p-4">
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      loading={<div className="p-8 text-center">Loading page...</div>}
                    />
                  </div>
                </Document>
              </div>

              {numPages && (
                <div className="mt-4 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={pageNumber <= 1}
                    className="p-2 bg-gray-200 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                    disabled={pageNumber >= numPages}
                    className="p-2 bg-gray-200 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Text + Insights Panel */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {showText ? "📝 Extracted Text" : "📝 Text Will Appear Here"}
                </h3>
                {showText && (
                  <button onClick={copyToClipboard} className="p-2 bg-blue-100 rounded hover:bg-blue-200">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="border rounded-lg h-[500px] overflow-auto bg-gray-50 p-4">
                {showText ? (
                  <div className="bg-white p-4 rounded border">
                    <div className="text-sm text-gray-600 mb-2">
                      {extractedText.length} characters extracted
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {extractedText}
                    </pre>

                    {healthInsights.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold mb-2 text-teal-800">
                          🧠 AI-Generated Health Insights
                        </h4>
                        <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
                          {healthInsights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Click "Extract Text" to see the text content here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
