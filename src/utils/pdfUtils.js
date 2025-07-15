import * as pdfjsLib from "pdfjs-dist";

// 🧠 Set up the worker - Use local worker file to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Alternative CDN options (use if local worker fails):
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
// pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export { pdfjsLib };

// Helper function to extract text from PDF
export async function extractTextFromPDF(file) {
  try {
    console.log("🔍 Starting PDF text extraction...");
    
    let pdfData;
    
    // Handle different file input types
    if (file instanceof File) {
      // Convert File to ArrayBuffer
      pdfData = await file.arrayBuffer();
    } else if (file instanceof Blob) {
      // Convert Blob to ArrayBuffer
      pdfData = await file.arrayBuffer();
    } else if (typeof file === "string") {
      // Handle URL strings
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      pdfData = await response.arrayBuffer();
    } else {
      // Assume it's already ArrayBuffer or similar
      pdfData = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const numPages = pdf.numPages;
    console.log(`📄 PDF loaded with ${numPages} pages`);
    
    let fullText = "";
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text with better formatting
        const pageText = textContent.items
          .map(item => {
            // Handle different text item types
            if (item.str) {
              return item.str;
            }
            return "";
          })
          .filter(text => text.trim() !== "") // Remove empty strings
          .join(" ");
        
        if (pageText.trim()) {
          fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
        }
        
        console.log(`✅ Extracted text from page ${pageNum}`);
      } catch (pageError) {
        console.warn(`⚠️ Error extracting text from page ${pageNum}:`, pageError);
        fullText += `--- Page ${pageNum} ---\n[Error extracting text from this page]\n\n`;
      }
    }
    
    console.log("🎉 PDF text extraction completed successfully");
    return fullText.trim();
    
  } catch (error) {
    console.error("❌ Error extracting text from PDF:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Helper function to get PDF metadata
export async function getPDFMetadata(file) {
  try {
    console.log("📊 Getting PDF metadata...");
    
    let pdfData;
    
    // Handle different file input types
    if (file instanceof File) {
      pdfData = await file.arrayBuffer();
    } else if (file instanceof Blob) {
      pdfData = await file.arrayBuffer();
    } else if (typeof file === "string") {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      pdfData = await response.arrayBuffer();
    } else {
      pdfData = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const metadata = await pdf.getMetadata();
    
    const result = {
      numPages: pdf.numPages,
      title: metadata.info?.Title || "Untitled Document",
      author: metadata.info?.Author || "Unknown Author",
      subject: metadata.info?.Subject || "",
      creator: metadata.info?.Creator || "",
      producer: metadata.info?.Producer || "",
      creationDate: metadata.info?.CreationDate || null,
      modificationDate: metadata.info?.ModDate || null,
      keywords: metadata.info?.Keywords || "",
      // Additional useful metadata
      pdfVersion: pdf.pdfInfo?.version || "Unknown",
      encrypted: pdf.pdfInfo?.encrypted || false,
      linearized: pdf.pdfInfo?.linearized || false
    };
    
    console.log("✅ PDF metadata extracted successfully");
    return result;
    
  } catch (error) {
    console.error("❌ Error getting PDF metadata:", error);
    throw new Error(`Failed to get PDF metadata: ${error.message}`);
  }
}

// Utility function to validate PDF file
export function isPDFFile(file) {
  if (!file) return false;
  
  // Check MIME type
  if (file.type === "application/pdf") return true;
  
  // Check file extension as fallback
  if (file.name && file.name.toLowerCase().endsWith('.pdf')) return true;
  
  return false;
}

// Utility function to get file size in human readable format
export function getFileSize(file) {
  if (!file || !file.size) return "Unknown size";
  
  const bytes = file.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}