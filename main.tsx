/** @jsxImportSource https://esm.sh/react */
import React, { useState, useEffect } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function ABICalculator() {
  const [measurements, setMeasurements] = useState({
    rightAnkleSystolic: '',
    leftAnkleSystolic: '',
    rightArmSystolic: '',
    leftArmSystolic: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateMeasurement = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateABI = () => {
    // Reset previous errors and start calculation
    setError(null);
    setIsCalculating(true);

    const {
      rightAnkleSystolic, 
      leftAnkleSystolic, 
      rightArmSystolic, 
      leftArmSystolic
    } = measurements;

    // Validate inputs
    const numericInputs = [
      rightAnkleSystolic, 
      leftAnkleSystolic, 
      rightArmSystolic, 
      leftArmSystolic
    ];

    const invalidInputs = numericInputs.some(input => 
      input === '' || isNaN(Number(input)) || Number(input) <= 0
    );

    if (invalidInputs) {
      setError('Please enter valid positive numeric values for all measurements.');
      setIsCalculating(false);
      return;
    }

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const rightABI = Number(rightAnkleSystolic) / Number(rightArmSystolic);
      const leftABI = Number(leftAnkleSystolic) / Number(leftArmSystolic);

      const calculateRiskInterpretation = (abi) => {
        if (abi > 1.4) return {
          category: "Calcified Vessels 🚨",
          description: "Potential arterial calcification. Requires immediate medical attention.",
          risk: "High",
          color: "#ff4757",
          gradient: "linear-gradient(135deg, #ff4757, #ff6b6b)",
          severity: 4
        };
        
        if (abi >= 1.0 && abi <= 1.4) return {
          category: "Normal Circulation 💚",
          description: "Ankle-Brachial Index indicates healthy blood flow.",
          risk: "Low",
          color: "#2ecc71",
          gradient: "linear-gradient(135deg, #2ecc71, #27ae60)",
          severity: 1
        };
        
        if (abi >= 0.91 && abi < 1.0) return {
          category: "Borderline 🟠",
          description: "Mild reduction in blood flow. Monitor and consult healthcare provider.",
          risk: "Moderate",
          color: "#f39c12",
          gradient: "linear-gradient(135deg, #f39c12, #d35400)",
          severity: 2
        };
        
        if (abi >= 0.61 && abi <= 0.90) return {
          category: "Mild PAD 🔶",
          description: "Early signs of Peripheral Artery Disease. Recommend medical evaluation.",
          risk: "Moderate to High",
          color: "#e67e22",
          gradient: "linear-gradient(135deg, #e67e22, #d35400)",
          severity: 3
        };
        
        if (abi <= 0.60) return {
          category: "Severe PAD 🚨",
          description: "Significant arterial blockage. Urgent medical intervention required.",
          risk: "Critical",
          color: "#c0392b",
          gradient: "linear-gradient(135deg, #c0392b, #e74c3c)",
          severity: 5
        };
      };

      setResults({
        rightABI: {
          value: rightABI.toFixed(2),
          interpretation: calculateRiskInterpretation(rightABI)
        },
        leftABI: {
          value: leftABI.toFixed(2),
          interpretation: calculateRiskInterpretation(leftABI)
        },
        averageABI: {
          value: ((rightABI + leftABI) / 2).toFixed(2),
          interpretation: calculateRiskInterpretation((rightABI + leftABI) / 2)
        }
      });

      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="abi-calculator">
      <header className="pulse-animation">
        <h1>🫀 Ankle-Brachial Index (ABI) Calculator</h1>
        <p>Assess your peripheral circulation and cardiovascular health</p>
      </header>

      <div className="measurement-section glass-morphism">
        <h2>Enter Blood Pressure Measurements</h2>
        
        {error && (
          <div className="error-message shake-animation">
            {error}
          </div>
        )}

        <div className="input-grid">
          {[
            { 
              label: "Right Ankle Systolic Pressure", 
              field: "rightAnkleSystolic",
              icon: "🦵"
            },
            { 
              label: "Left Ankle Systolic Pressure", 
              field: "leftAnkleSystolic",
              icon: "🦵"
            },
            { 
              label: "Right Arm Systolic Pressure", 
              field: "rightArmSystolic",
              icon: "💪"
            },
            { 
              label: "Left Arm Systolic Pressure", 
              field: "leftArmSystolic",
              icon: "💪"
            }
          ].map((input, index) => (
            <div key={index} className="input-group">
              <label>
                {input.icon} {input.label} (mmHg)
              </label>
              <input
                type="number"
                value={measurements[input.field]}
                onChange={(e) => updateMeasurement(input.field, e.target.value)}
                placeholder={`Enter ${input.label.toLowerCase()}`}
                className="input-field"
              />
            </div>
          ))}
        </div>

        <button 
          onClick={calculateABI} 
          className={`calculate-btn ${isCalculating ? 'calculating' : ''}`}
          disabled={isCalculating}
        >
          {isCalculating ? 'Calculating...' : 'Calculate ABI'}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <h2>ABI Calculation Results</h2>
          <div className="result-cards">
            {['rightABI', 'leftABI', 'averageABI'].map((type) => (
              <div 
                key={type} 
                className="result-card slide-in"
                style={{
                  background: results[type].interpretation.gradient,
                  color: 'white'
                }}
              >
                <h3>
                  {type === 'rightABI' ? 'Right' : 
                   type === 'leftABI' ? 'Left' : 'Average'} ABI
                </h3>
                <p className="abi-value">{results[type].value}</p>
                <div className="interpretation">
                  <strong>{results[type].interpretation.category}</strong>
                  <p>{results[type].interpretation.description}</p>
                  <p>Risk Level: {results[type].interpretation.risk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="disclaimer glass-morphism">
        <h3>⚠️ Medical Disclaimer</h3>
        <p>This tool provides general health information. Always consult healthcare professionals for personalized medical advice.</p>
      </div>
    </div>
  );
}

function client() {
  createRoot(document.getElementById("root")).render(<ABICalculator />);
}
if (typeof document !== "undefined") { client(); }

export default async function server(request: Request): Promise<Response> {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Comprehensive Ankle-Brachial Index (ABI) Calculator",
    "description": "Advanced medical tool for assessing peripheral circulation and cardiovascular health through Ankle-Brachial Index measurement",
    "keywords": [
      "ABI calculator", 
      "Peripheral Artery Disease", 
      "Cardiovascular Health", 
      "Medical Diagnostic Tool"
    ]
  };

  
