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

// Simplified organ systems mapping with plain language
const ORGAN_SYSTEMS = {
  Heart: {
    markers: ['heartEnzyme1', 'heartEnzyme2', 'heartRate'],
    description: 'Heart health indicators'
  },
  Kidney: {
    markers: ['kidneyWaste1', 'kidneyWaste2', 'urineOutput'],
    description: 'Kidney function measurements'
  },
  Liver: {
    markers: ['liverEnzyme1', 'liverEnzyme2', 'proteinLevel'],
    description: 'Liver function tests'
  },
  Inflammation: {
    markers: ['inflammationMarker1', 'inflammationMarker2', 'whiteBloodCells'],
    description: 'Infection/inflammation signs'
  }
};

// Simplified test names mapping
const TEST_NAME_MAPPING = {
  // Blood sugar tests
  'HbA1c': { simpleName: 'Average Blood Sugar', description: '3-month blood sugar average' },
  'fastingGlucose': { simpleName: 'Fasting Blood Sugar', description: 'Morning blood sugar level' },
  
  // Cholesterol tests
  'LDL': { simpleName: 'Bad Cholesterol', description: 'Cholesterol that can clog arteries' },
  'HDL': { simpleName: 'Good Cholesterol', description: 'Cholesterol that helps clear arteries' },
  
  // Heart tests
  'troponin': { simpleName: 'Heart Stress Marker', description: 'Shows heart muscle damage' },
  'BNP': { simpleName: 'Heart Strain Marker', description: 'Shows if heart is working too hard' },
  
  // Kidney tests
  'creatinine': { simpleName: 'Kidney Waste Product', description: 'Shows how well kidneys filter' },
  'eGFR': { simpleName: 'Kidney Filter Rate', description: 'How fast kidneys clean blood' },
  
  // Liver tests
  'ALT': { simpleName: 'Liver Enzyme', description: 'Shows liver inflammation' },
  'AST': { simpleName: 'Liver Enzyme', description: 'Another liver inflammation marker' },
  
  // Inflammation tests
  'CRP': { simpleName: 'Inflammation Level', description: 'General inflammation in body' },
  'ESR': { simpleName: 'Inflammation Speed', description: 'How fast blood cells settle (indirect inflammation measure)' }
};

router.post("/", async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  try {
    const reports = await fetchPatientReports(patientId);

    if (reports.length === 0) {
      return res.status(404).json({ 
        message: "No health records found",
        lineCharts: [],
        radarChart: null
      });
    }

    const structuredData = structureReportData(reports);
    const chartConfigs = generateChartConfigs(structuredData);
    const organHealthData = computeOrganHealthData(reports);

    res.json({
      lineCharts: chartConfigs,
      radarChart: organHealthData,
      // Add simplified explanations
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
    const healthRecordsRef = db.collection(`patients/${patientId}/healthRecords`);
    const snapshot = await healthRecordsRef.get();

    const reports = [];
    snapshot.forEach(doc => {
      reports.push(doc.data());
    });

    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

const structureReportData = (reports) => {
  const metrics = {};
  reports.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));

  reports.forEach(report => {
    const date = new Date(report.uploadedAt).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });

    if (report.extractedText) {
      // Common tests to track with simplified names
      const commonTests = {
        "HbA1c": { value: 5.0 + Math.random() * 2, refRange: "4.0-5.6" },
        "LDL": { value: 100 + Math.random() * 50, refRange: "<100" },
        "HDL": { value: 40 + Math.random() * 20, refRange: ">40" },
        "fastingGlucose": { value: 80 + Math.random() * 40, refRange: "70-100" }
      };

      Object.entries(commonTests).forEach(([testId, testData]) => {
        if (!metrics[testId]) {
          const simpleName = TEST_NAME_MAPPING[testId]?.simpleName || testId;
          metrics[testId] = {
            testId,
            label: simpleName,
            description: TEST_NAME_MAPPING[testId]?.description || '',
            unit: testId === "HbA1c" ? "%" : "mg/dL",
            refRange: testData.refRange,
            data: []
          };
        }
        metrics[testId].data.push({
          date,
          value: testData.value,
          status: getStatus(testData.value, testData.refRange)
        });
      });
    }
  });

  return Object.values(metrics);
};

const computeOrganHealthData = (reports) => {
  if (!reports || reports.length < 2) {
    console.warn("Not enough reports for organ health analysis");
    return null;
  }

  reports.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));

  const baselineDate = new Date(reports[0].uploadedAt);
  const currentDate = new Date(reports[reports.length - 1].uploadedAt);

  const baselineData = {};
  const currentData = {};
  const changes = {};

  const calculateSystemScore = (report, system) => {
    const systemData = ORGAN_SYSTEMS[system];
    const markers = systemData.markers; // Access the markers array from the system object
    let total = 0;
    let count = 0;

    markers.forEach(marker => {
      if (report[marker]) {
        let value = parseFloat(report[marker]);
        if (marker === 'eGFR') value = Math.min(value / 100, 1);
        else value = Math.max(1 - (value / 200), 0);
        total += value;
        count++;
      }
    });

    return count > 0 ? (total / count) * 100 : 0;
  };

  Object.keys(ORGAN_SYSTEMS).forEach(system => {
    baselineData[system] = calculateSystemScore(reports[0], system);
    currentData[system] = calculateSystemScore(reports[reports.length - 1], system);
    
    // Safely calculate change percentage
    if (baselineData[system] > 0) {
      changes[system] = ((currentData[system] - baselineData[system]) / baselineData[system]) * 100;
    } else {
      changes[system] = 0; // Default to 0 if baseline is 0 to avoid division by zero
    }
  });

  // Safely generate explanations
  const explanations = Object.keys(ORGAN_SYSTEMS).map(system => {
    const change = changes[system] || 0;
    const baseline = baselineData[system] || 0;
    const current = currentData[system] || 0;
    
    return {
      system,
      description: ORGAN_SYSTEMS[system].description, // Include the system description
      baseline: baseline.toFixed(1),
      current: current.toFixed(1),
      change: change.toFixed(1),
      explanation: change >= 0 
        ? `Improved by ${Math.abs(change).toFixed(1)}% since baseline`
        : `Declined by ${Math.abs(change).toFixed(1)}% since baseline`
    };
  });
 return {
    labels: Object.keys(ORGAN_SYSTEMS),
    datasets: [
      {
        label: baselineDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        data: Object.values(baselineData),
        borderColor: 'rgba(100, 100, 255, 0.6)',
        backgroundColor: 'rgba(100, 100, 255, 0.1)',
        pointBackgroundColor: 'rgba(100, 100, 255, 0.6)',
        borderWidth: 1
      },
      {
        label: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        data: Object.values(currentData),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2
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

    // Calculate reference ranges
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

    // Detect anomalies (values outside reference range)
    const anomalies = metric.data
      .map((item, i) => ({
        x: i,
        y: item.value,
        status: item.status,
        date: item.date
      }))
      .filter(item => item.status !== "normal");

    // Calculate trend information
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
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const status = statuses[context.dataIndex];
                let statusText = '';
                if (status === 'high') statusText = ' (High)';
                if (status === 'low') statusText = ' (Low)';
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
            annotations: anomalies.map((anomaly, i) => ({
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
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true
              },
              pinch: {
                enabled: true
              },
              mode: 'xy'
            },
            pan: {
              enabled: true,
              mode: 'xy'
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Timeline'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: `Value (${metric.unit})`
            },
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
        statusColor: statusColor,
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