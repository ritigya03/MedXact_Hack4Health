import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
const db = admin.firestore();

// Organ systems mapping with real medical markers
const ORGAN_SYSTEMS = {
  Heart: {
    markers: ['troponin', 'BNP', 'heartRate'],
    description: 'Heart health indicators'
  },
  Kidney: {
    markers: ['creatinine', 'eGFR', 'BUN'],
    description: 'Kidney function measurements'
  },
  Liver: {
    markers: ['ALT', 'AST', 'bilirubin'],
    description: 'Liver function tests'
  },
  Inflammation: {
    markers: ['CRP', 'ESR', 'WBC'],
    description: 'Infection/inflammation signs'
  }
};

// Medical test mapping with reference ranges
const TEST_NAME_MAPPING = {
  'HbA1c': { 
    simpleName: 'Average Blood Sugar', 
    description: '3-month blood sugar average',
    refRange: "4.0-5.6",
    unit: "%"
  },
  'fastingGlucose': { 
    simpleName: 'Fasting Blood Sugar', 
    description: 'Morning blood sugar level',
    refRange: "70-100",
    unit: "mg/dL"
  },
  'LDL': { 
    simpleName: 'Bad Cholesterol', 
    description: 'Cholesterol that can clog arteries',
    refRange: "<100",
    unit: "mg/dL"
  },
  'HDL': { 
    simpleName: 'Good Cholesterol', 
    description: 'Cholesterol that helps clear arteries',
    refRange: ">40",
    unit: "mg/dL"
  },
  'troponin': { 
    simpleName: 'Heart Stress Marker', 
    description: 'Shows heart muscle damage',
    refRange: "<0.04",
    unit: "ng/mL"
  },
  'creatinine': { 
    simpleName: 'Kidney Waste Product', 
    description: 'Shows how well kidneys filter',
    refRange: "0.7-1.3",
    unit: "mg/dL"
  },
  'eGFR': { 
    simpleName: 'Kidney Filter Rate', 
    description: 'How fast kidneys clean blood',
    refRange: ">60",
    unit: "mL/min"
  },
  'ALT': { 
    simpleName: 'Liver Enzyme', 
    description: 'Shows liver inflammation',
    refRange: "7-55",
    unit: "U/L"
  },
  'AST': { 
    simpleName: 'Liver Enzyme', 
    description: 'Another liver inflammation marker',
    refRange: "8-48",
    unit: "U/L"
  },
  'CRP': { 
    simpleName: 'Inflammation Level', 
    description: 'General inflammation in body',
    refRange: "<1.0",
    unit: "mg/L"
  },
  'ESR': { 
    simpleName: 'Inflammation Speed', 
    description: 'How fast blood cells settle',
    refRange: "0-20",
    unit: "mm/hr"
  }
};

// Risk explanations for each test
const TEST_RISKS = {
  'HbA1c': {
    high: "High HbA1c indicates poor blood sugar control. This increases risk of diabetes complications: heart disease, stroke, kidney disease, nerve damage, and eye problems.",
    low: "Low HbA1c may indicate frequent hypoglycemia which can cause dizziness, confusion, and loss of consciousness."
  },
  'fastingGlucose': {
    high: "High fasting glucose suggests prediabetes or diabetes. Risks include frequent urination, increased thirst, blurred vision, and long-term organ damage.",
    low: "Low fasting glucose (hypoglycemia) can cause shakiness, sweating, confusion, and in severe cases, loss of consciousness."
  },
  'LDL': {
    high: "High LDL (bad cholesterol) can lead to plaque buildup in arteries, increasing risk of heart attack and stroke.",
    low: "Low LDL is generally beneficial but extremely low levels may increase bleeding risk."
  },
  'HDL': {
    high: "High HDL (good cholesterol) is protective against heart disease.",
    low: "Low HDL increases risk of heart disease as it helps remove bad cholesterol from arteries."
  },
  'troponin': {
    high: "Elevated troponin suggests heart muscle damage, possibly from a heart attack, heart inflammation, or other cardiac stress.",
    low: "Low troponin is normal and expected."
  },
  'creatinine': {
    high: "High creatinine indicates poor kidney function. Risks include fluid retention, electrolyte imbalances, and toxin buildup.",
    low: "Low creatinine may suggest low muscle mass but is generally not concerning."
  },
  'eGFR': {
    high: "High eGFR is generally not concerning and may indicate excellent kidney function.",
    low: "Low eGFR indicates reduced kidney function. Risks include fluid retention, high blood pressure, and anemia."
  },
  'ALT': {
    high: "High ALT suggests liver inflammation or damage from conditions like hepatitis, fatty liver disease, or alcohol use.",
    low: "Low ALT is normal and expected."
  },
  'AST': {
    high: "High AST may indicate liver damage, heart problems, or muscle injury.",
    low: "Low AST is normal and expected."
  },
  'CRP': {
    high: "High CRP indicates inflammation in the body from infection, autoimmune disease, or other inflammatory conditions.",
    low: "Low CRP is normal and suggests no significant inflammation."
  },
  'ESR': {
    high: "High ESR suggests inflammation from infection, autoimmune disease, or other inflammatory conditions.",
    low: "Low ESR is normal and expected."
  }
};

// Potential diseases mapping
const POTENTIAL_DISEASES = {
  'HbA1c': {
    high: ["Diabetes", "Prediabetes", "Metabolic syndrome"],
    low: ["Hypoglycemia", "Overmedication with diabetes drugs"]
  },
  'fastingGlucose': {
    high: ["Diabetes", "Prediabetes", "Pancreatic disorders"],
    low: ["Hypoglycemia", "Liver disease", "Hormone deficiencies"]
  },
  'LDL': {
    high: ["Heart disease", "Atherosclerosis", "Stroke risk"],
    low: ["Malnutrition", "Hyperthyroidism"]
  },
  'HDL': {
    high: ["Generally protective"],
    low: ["Heart disease risk", "Metabolic syndrome"]
  },
  'troponin': {
    high: ["Heart attack", "Heart failure", "Myocarditis"],
    low: ["Normal finding"]
  },
  'creatinine': {
    high: ["Kidney disease", "Dehydration", "Urinary obstruction"],
    low: ["Low muscle mass", "Pregnancy"]
  },
  'eGFR': {
    high: ["Normal variant"],
    low: ["Chronic kidney disease", "Acute kidney injury"]
  },
  'ALT': {
    high: ["Hepatitis", "Fatty liver disease", "Liver damage"],
    low: ["Normal finding"]
  },
  'AST': {
    high: ["Liver disease", "Heart attack", "Muscle injury"],
    low: ["Normal finding"]
  },
  'CRP': {
    high: ["Infection", "Autoimmune disease", "Inflammatory conditions"],
    low: ["Normal finding"]
  },
  'ESR': {
    high: ["Infection", "Autoimmune disease", "Cancer"],
    low: ["Normal finding"]
  }
};

router.post("/", async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    console.log(`Fetching reports for patient: ${patientId}`);
    const reports = await fetchPatientReports(patientId);

    if (reports.length === 0) {
      console.log("No reports found for patient");
      return res.status(404).json({ 
        message: "No health records found",
        lineCharts: [],
        radarChart: null
      });
    }

    console.log(`Processing ${reports.length} reports`);
    const structuredData = await structureReportData(reports);
    const chartConfigs = generateChartConfigs(structuredData);
    const organHealthData = computeOrganHealthData(reports);

    console.log("Successfully generated visual insights");
    res.json({
      lineCharts: chartConfigs,
      radarChart: organHealthData,
      simplifiedTerms: TEST_NAME_MAPPING
    });

  } catch (err) {
    console.error("Visual insights error:", err);
    res.status(500).json({ 
      error: "Failed to generate visual insights",
      details: err.message 
    });
  }
});

const fetchPatientReports = async (patientId) => {
  try {
    console.log(`Fetching reports from Firebase for patient ${patientId}`);
    const healthRecordsRef = db.collection(`patients/${patientId}/healthRecords`);
    const snapshot = await healthRecordsRef.get();

    const reports = [];
    snapshot.forEach(doc => {
      reports.push(doc.data());
    });

    console.log(`Found ${reports.length} reports`);
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

const extractMedicalValues = (text) => {
  const values = {};
  
  if (!text) return values;

  console.log("Extracting values from report text...");
  
  // Enhanced pattern matching for medical values
  const patterns = {
    HbA1c: /(?:HbA1c|Glycated\s+Hemoglobin)[\s:]*([\d.]+)\s*%?/i,
    fastingGlucose: /(?:Fasting\s+Glucose|FBS|Blood\s+Sugar)[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*dL)?/i,
    LDL: /LDL[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*dL)?/i,
    HDL: /HDL[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*dL)?/i,
    troponin: /Troponin[\s:]*([\d.]+)\s*(?:ng\s*\/?\s*mL)?/i,
    creatinine: /Creatinine[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*dL)?/i,
    eGFR: /eGFR[\s:]*([\d.]+)\s*(?:mL\s*\/?\s*min)?/i,
    ALT: /ALT[\s:]*([\d.]+)\s*(?:U\s*\/?\s*L)?/i,
    AST: /AST[\s:]*([\d.]+)\s*(?:U\s*\/?\s*L)?/i,
    CRP: /CRP[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*L)?/i,
    ESR: /ESR[\s:]*([\d.]+)\s*(?:mm\s*\/?\s*hr)?/i,
    BUN: /BUN[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*dL)?/i,
    bilirubin: /Bilirubin[\s:]*([\d.]+)\s*(?:mg\s*\/?\s*dL)?/i,
    WBC: /WBC[\s:]*([\d.]+)\s*(?:thousand\s*\/?\s*µL)?/i,
    heartRate: /(?:Heart\s+Rate|HR)[\s:]*([\d.]+)\s*(?:bpm)?/i
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      values[key] = parseFloat(match[1]);
      console.log(`Found ${key}: ${values[key]}`);
    }
  });

  return values;
};

const extractReportDate = (text) => {
  if (!text) return null;

  const datePatterns = [
    /(?:Date of Report|Report Date|Date)[\s:]*(\d{1,2}-[a-zA-Z]{3}-\d{4})/i,
    /(?:Date of Report|Report Date|Date)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:Date of Report|Report Date|Date)[\s:]*(\d{4}-\d{1,2}-\d{1,2})/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      try {
        const dateStr = match[1];
        let dateObj;
        
        if (dateStr.includes('-')) {
          if (/^\d{1,2}-[a-zA-Z]{3}-\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('-');
            const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", 
                               "jul", "aug", "sep", "oct", "nov", "dec"];
            const monthIndex = monthNames.indexOf(month.toLowerCase());
            if (monthIndex !== -1) {
              dateObj = new Date(year, monthIndex, day);
            }
          }
          else {
            dateObj = new Date(dateStr);
          }
        }
        else if (dateStr.includes('/')) {
          const [part1, part2, year] = dateStr.split('/');
          dateObj = new Date(`${year}-${part1}-${part2}`);
          if (isNaN(dateObj.getTime())) {
            dateObj = new Date(`${year}-${part2}-${part1}`);
          }
        }
        
        if (dateObj && !isNaN(dateObj.getTime())) {
          console.log(`Extracted report date: ${dateObj.toISOString()}`);
          return dateObj;
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }
  
  console.log("No valid report date found in text");
  return null;
};

const structureReportData = async (reports) => {
  const metrics = {};
  
  const reportsWithDates = reports.map(report => {
    let reportDate;
    
    if (report.extractedText) {
      reportDate = extractReportDate(report.extractedText);
    }
    
    if (!reportDate) {
      reportDate = new Date(report.uploadedAt);
      console.log(`Using upload date for report: ${reportDate.toISOString()}`);
    }
    
    return {
      ...report,
      reportDate
    };
  });
  
  reportsWithDates.sort((a, b) => a.reportDate - b.reportDate);

  console.log("Processing reports with dates:", 
    reportsWithDates.map(r => ({
      date: r.reportDate.toLocaleDateString('en-IN'),
      source: r.reportDate === new Date(r.uploadedAt) ? "uploadDate" : "reportText"
    })));

  for (const report of reportsWithDates) {
    try {
      const date = report.reportDate.toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      });

      console.log(`Processing report from ${date}`);

      if (report.extractedText) {
        const extractedValues = extractMedicalValues(report.extractedText);
        console.log(`Extracted values for ${date}:`, extractedValues);

        Object.entries(TEST_NAME_MAPPING).forEach(([testId, testInfo]) => {
          if (extractedValues[testId] !== undefined) {
            if (!metrics[testId]) {
              metrics[testId] = {
                testId,
                label: testInfo.simpleName,
                description: testInfo.description,
                unit: testInfo.unit,
                refRange: testInfo.refRange,
                data: []
              };
            }
            
            metrics[testId].data.push({
              date,
              value: extractedValues[testId],
              status: getStatus(extractedValues[testId], testInfo.refRange)
            });
          }
        });
      }
    } catch (error) {
      console.error(`Error processing report:`, error);
    }
  }

  console.log("Final metrics structure:", Object.keys(metrics));
  return Object.values(metrics);
};

const computeOrganHealthData = (reports) => {
  if (!reports || reports.length < 2) {
    console.warn("Not enough reports for organ health analysis");
    return null;
  }

  const reportsWithDates = reports.map(report => {
    let reportDate;
    
    if (report.extractedText) {
      reportDate = extractReportDate(report.extractedText);
    }
    
    if (!reportDate) {
      reportDate = new Date(report.uploadedAt);
    }
    
    return {
      ...report,
      reportDate
    };
  });
  
  reportsWithDates.sort((a, b) => a.reportDate - b.reportDate);

  const baselineDate = reportsWithDates[0].reportDate;
  const currentDate = reportsWithDates[reportsWithDates.length - 1].reportDate;

  console.log(`Calculating organ health from ${baselineDate} to ${currentDate}`);

  const baselineData = {};
  const currentData = {};
  const changes = {};

  const calculateSystemScore = (report, system) => {
    const systemData = ORGAN_SYSTEMS[system];
    const markers = systemData.markers;
    let total = 0;
    let count = 0;

    const extractedValues = report.extractedText ? extractMedicalValues(report.extractedText) : {};

    markers.forEach(marker => {
      if (extractedValues[marker] !== undefined) {
        let value = extractedValues[marker];
        const refRange = TEST_NAME_MAPPING[marker]?.refRange;
        
        if (refRange) {
          if (marker === 'eGFR') {
            value = Math.min(value / 100, 1) * 100;
          } else {
            const [min, max] = refRange.includes('-') 
              ? refRange.split('-').map(Number)
              : refRange.startsWith('<')
                ? [0, Number(refRange.substring(1))]
                : [Number(refRange.substring(1)), Number(refRange.substring(1)) * 2];
            
            value = Math.max(0, 100 - ((value - min) / (max - min)) * 100);
          }
          total += value;
          count++;
        }
      }
    });

    return count > 0 ? total / count : 0;
  };

  Object.keys(ORGAN_SYSTEMS).forEach(system => {
    baselineData[system] = calculateSystemScore(reportsWithDates[0], system);
    currentData[system] = calculateSystemScore(reportsWithDates[reportsWithDates.length - 1], system);
    
    if (baselineData[system] > 0) {
      changes[system] = ((currentData[system] - baselineData[system]) / baselineData[system]) * 100;
    } else {
      changes[system] = 0;
    }
  });

  const explanations = Object.keys(ORGAN_SYSTEMS).map(system => ({
    system,
    description: ORGAN_SYSTEMS[system].description,
    baseline: baselineData[system].toFixed(1),
    current: currentData[system].toFixed(1),
    change: changes[system].toFixed(1),
    explanation: changes[system] >= 0 
      ? `Improved by ${Math.abs(changes[system]).toFixed(1)}% since baseline`
      : `Declined by ${Math.abs(changes[system]).toFixed(1)}% since baseline`,
    riskLevel: changes[system] < -10 ? "High" : changes[system] < 0 ? "Moderate" : "Low",
    riskColor: changes[system] < -10 ? "#e74c3c" : changes[system] < 0 ? "#f39c12" : "#2ecc71",
    recommendations: changes[system] < 0 
      ? ["Consult specialist", "Get follow-up tests"] 
      : ["Maintain healthy habits"]
  }));

  return {
    labels: Object.keys(ORGAN_SYSTEMS).map(sys => `${sys}\n${ORGAN_SYSTEMS[sys].description}`),
    datasets: [
      {
        label: `Baseline (${baselineDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`,
        data: Object.values(baselineData),
        borderColor: 'rgba(100, 100, 255, 0.8)',
        backgroundColor: 'rgba(100, 100, 255, 0.2)',
        pointBackgroundColor: 'rgba(100, 100, 255, 0.8)',
        pointRadius: 5,
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: `Current (${currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`,
        data: Object.values(currentData),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 6,
        borderWidth: 2,
        tension: 0.3
      }
    ],
    changes,
    baselineDate: baselineDate.toISOString(),
    currentDate: currentDate.toISOString(),
    explanations
  };
};

const getStatus = (value, refRange) => {
  if (!refRange) return "normal";

  if (refRange.includes("-")) {
    const [min, max] = refRange.split("-").map(parseFloat);
    if (value < min) return "low";
    if (value > max) return "high";
    return "normal";
  } else if (refRange.startsWith("<")) {
    const max = parseFloat(refRange.substring(1));
    return value > max ? "high" : "normal";
  } else if (refRange.startsWith(">")) {
    const min = parseFloat(refRange.substring(1));
    return value < min ? "low" : "normal";
  }

  return "normal";
};

const generateChartConfigs = (structuredData) => {
  return structuredData.map(metric => {
    const labels = metric.data.map(item => item.date);
    const data = metric.data.map(item => item.value);
    const statuses = metric.data.map(item => item.status);

    let refMin, refMax;
    if (metric.refRange.includes("-")) {
      [refMin, refMax] = metric.refRange.split("-").map(parseFloat);
    } else if (metric.refRange.startsWith("<")) {
      refMax = parseFloat(metric.refRange.substring(1));
      refMin = refMax * 0.7;
    } else if (metric.refRange.startsWith(">")) {
      refMin = parseFloat(metric.refRange.substring(1));
      refMax = refMin * 1.3;
    }

    const anomalies = metric.data
      .map((item, i) => ({ x: i, y: item.value, status: item.status, date: item.date }))
      .filter(item => item.status !== "normal");

    // Calculate trend
    const values = metric.data.map(d => d.value);
    const lastValue = values[values.length - 1];
    const prevValue = values.length > 1 ? values[values.length - 2] : null;
    
    let trend = "stable";
    let trendIcon = "→";
    let trendColor = "#666";
    if (prevValue !== null) {
      if (lastValue > prevValue + (refMax * 0.05)) {
        trend = "increasing";
        trendIcon = "↑";
        trendColor = "#e74c3c";
      } else if (lastValue < prevValue - (refMax * 0.05)) {
        trend = "decreasing";
        trendIcon = "↓";
        trendColor = "#3498db";
      }
    }

    const currentStatus = getStatus(lastValue, metric.refRange);
    const statusColor = currentStatus === "normal" ? "#2ecc71" : 
                      currentStatus === "high" ? "#e74c3c" : "#3498db";

    // Get risk explanation and potential diseases
    const riskExplanation = TEST_RISKS[metric.testId] && TEST_RISKS[metric.testId][currentStatus] 
      ? TEST_RISKS[metric.testId][currentStatus] 
      : "No significant risk identified";
    
    const potentialDiseases = POTENTIAL_DISEASES[metric.testId] && POTENTIAL_DISEASES[metric.testId][currentStatus]
      ? POTENTIAL_DISEASES[metric.testId][currentStatus]
      : ["No significant disease risk identified"];

    // Create risk zones
    const riskAnnotations = [];
    if (metric.refRange.includes("-")) {
      riskAnnotations.push(
        {
          type: 'box',
          yMin: refMin,
          yMax: refMax,
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: 'transparent',
          xMin: 'min',
          xMax: 'max',
          label: {
            content: 'Safe Zone',
            enabled: true,
            position: 'center',
            backgroundColor: 'rgba(46, 204, 113, 0.7)',
            color: '#fff'
          }
        },
        {
          type: 'box',
          yMin: 'min',
          yMax: refMin,
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderColor: 'transparent',
          xMin: 'min',
          xMax: 'max',
          label: {
            content: 'Low Risk Zone',
            enabled: true,
            position: 'bottom',
            backgroundColor: 'rgba(52, 152, 219, 0.7)',
            color: '#fff'
          }
        },
        {
          type: 'box',
          yMin: refMax,
          yMax: 'max',
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          borderColor: 'transparent',
          xMin: 'min',
          xMax: 'max',
          label: {
            content: 'High Risk Zone',
            enabled: true,
            position: 'top',
            backgroundColor: 'rgba(231, 76, 60, 0.7)',
            color: '#fff'
          }
        }
      );
    }

    // Add descriptive text boxes for anomalies
    const anomalyNotes = anomalies.map((anomaly, index) => ({
      type: 'label',
      content: `⚠️ ${anomaly.status.toUpperCase()} on ${anomaly.date}`,
      position: {x: anomaly.x, y: anomaly.y},
      xAdjust: 0,
      yAdjust: -15 - (index * 15), // Stagger if multiple
      backgroundColor: 'rgba(241, 196, 15, 0.8)',
      color: '#000',
      font: {size: 12},
      borderRadius: 4,
      padding: 4
    }));

    return {
      testId: metric.testId,
      metric: metric.label,
      description: metric.description,
      chartType: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${metric.label} (${metric.unit})`,
            data,
            borderColor: statusColor,
            backgroundColor: `${statusColor}20`,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: data.map((_, i) => 
              statuses[i] === "normal" ? statusColor : "#f1c40f"
            ),
            pointRadius: data.map((_, i) => 
              statuses[i] === "normal" ? 4 : 6
            ),
            pointHoverRadius: data.map((_, i) => 
              statuses[i] === "normal" ? 6 : 9
            ),
            borderWidth: 2
          },
          {
            label: 'Reference Range',
            data: Array(data.length).fill(refMax),
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: '-1'
          },
          {
            label: 'Reference Range',
            data: Array(data.length).fill(refMin),
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: '-1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${metric.label} Trend Analysis`,
            font: { size: 16, weight: 'bold' }
          },
          subtitle: {
            display: true,
            text: riskExplanation,
            color: currentStatus === "normal" ? '#2ecc71' : 
                  currentStatus === "high" ? '#e74c3c' : '#3498db',
            font: {size: 14, weight: 'bold'},
            padding: {top: 10, bottom: 20}
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const status = statuses[context.dataIndex];
                let statusText = status === 'high' ? ' (High)' : status === 'low' ? ' (Low)' : '';
                return `${context.dataset.label}: ${context.raw}${statusText}`;
              },
              afterLabel: function(context) {
                const index = context.dataIndex;
                if (anomalies.some(a => a.x === index)) {
                  return '⚠️ Anomaly detected';
                }
              }
            }
          },
          annotation: {
            annotations: [
              ...riskAnnotations,
              ...anomalyNotes,
              ...anomalies.map(anomaly => ({
                type: 'box',
                xMin: anomaly.x - 0.5,
                xMax: anomaly.x + 0.5,
                yMin: anomaly.status === 'high' ? refMax : 0,
                yMax: anomaly.status === 'high' ? Math.max(...data) * 1.1 : refMin,
                backgroundColor: 'rgba(241, 196, 15, 0.2)',
                borderColor: 'rgba(241, 196, 15, 0.5)',
                borderWidth: 1,
                label: {
                  content: `Anomaly: ${anomaly.status.toUpperCase()}`,
                  enabled: true,
                  position: anomaly.status === 'high' ? 'top' : 'bottom'
                }
              }))
            ]
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Timeline' },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: `Value (${metric.unit})` },
            min: Math.min(...data) * 0.9,
            max: Math.max(...data) * 1.1,
            ticks: {
              callback: function(value) {
                if (value === refMax) return `Max (${refMax})`;
                if (value === refMin) return `Min (${refMin})`;
                return value;
              }
            }
          }
        }
      },
      summary: {
        currentValue: lastValue,
        unit: metric.unit,
        status: currentStatus,
        statusColor,
        statusExplanation: currentStatus === "normal" 
          ? "Within healthy range" 
          : currentStatus === "high" 
            ? "Higher than recommended" 
            : "Lower than recommended",
        trend,
        trendIcon,
        trendColor,
        normalRange: metric.refRange,
        whatItMeans: metric.description,
        riskExplanation,
        potentialDiseases,
        riskLevel: currentStatus === "normal" ? "Low" : "High",
        riskColor: currentStatus === "normal" ? "#2ecc71" : 
                 currentStatus === "high" ? "#e74c3c" : "#3498db",
        actionItems: currentStatus === "normal" 
          ? ["Continue healthy habits"] 
          : ["Consult your doctor", "Consider lifestyle changes"],
        anomalies: anomalies.map(a => ({
          date: a.date,
          value: a.y,
          status: a.status
        }))
      }
    };
  });
};

export default router;