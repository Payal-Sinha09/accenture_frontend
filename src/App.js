import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

dotenv.config({ path: 'config/uri.env' });

const App = () => {
  // State variables for inputs
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [recyclability, setRecyclability] = useState(0);
  const [renewableSource, setRenewableSource] = useState(0);
  const [optimizedImpact, setOptimizedImpact] = useState(null);
  
  // New state variables for the optimized results
  const [optimizedDimensions, setOptimizedDimensions] = useState({});
  const [surfaceArea, setSurfaceArea] = useState(null);
  const [materialCost, setMaterialCost] = useState(null);

  // Sample data for chart
  const data = {
    labels: ['Environmental Impact'],
    datasets: [
      {
        label: 'Optimized Impact',
        data: optimizedImpact ? [optimizedImpact] : [0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Function to calculate optimized environmental impact
  const calculateOptimizedImpact = async () => {
    // Simple formula for demonstration; can be replaced with a more complex calculation
    const impact = (parseFloat(weight) * (1 - recyclability / 100) * (1 - renewableSource / 100));
    setOptimizedImpact(impact.toFixed(2)); // Store the calculated impact

    // Prepare the dimensions and material type to send to the backend
    const dimensions = [parseFloat(length), parseFloat(width), parseFloat(height)];
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    try {
      // Send a request to the backend to calculate optimized packaging
      const response = await fetch(`${API_URL}/optimize-packaging`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dimensions: dimensions,
          material_type: material.toLowerCase(),
        }),
      });
      
      // Parse the response from the backend
      const result = await response.json();
      console.log(result); 
      // Check if the backend returned valid data
      if (response.ok) {
        // Update the state with the optimized values
        setOptimizedDimensions(result.optimized_packaging);
        setSurfaceArea(result.surfaceArea);
        console.log(surfaceArea);
        setMaterialCost(result.materialUsed);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <h1>Packaging Optimization</h1>

      <div className="input-section">
        <h2>Input Packaging Parameters</h2>

        <label>
          Material Type:
          <select value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="">Select Material</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Biodegradable">Biodegradable</option>
          </select>
        </label>

        <label>
          Weight (grams):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>

        <label>
          Height (cm):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>

        <label>
          Length (cm):
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </label>

        <label>
          Width (cm):
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </label>

        <label>
          Recyclability (%):
          <input
            type="number"
            value={recyclability}
            onChange={(e) => setRecyclability(e.target.value)}
            max="100"
          />
        </label>

        <label>
          Renewable Source (%):
          <input
            type="number"
            value={renewableSource}
            onChange={(e) => setRenewableSource(e.target.value)}
            max="100"
          />
        </label>

        <button onClick={calculateOptimizedImpact}>Calculate Optimized Impact</button>
      </div>

      <div className="chart-section">
        <h2>Optimized Environmental Impact</h2>
        <Bar data={data} />
        {optimizedImpact !== null && (
          <p>Optimized Environmental Impact: {optimizedImpact} (unit: environmental score)</p>
        )}
      </div>
      
      <h2>Environmental Factors Overview</h2>
      <p>Environmental factors include sustainable material selection, weight reduction, recyclability, and the use of renewable resources. Optimizing these factors helps reduce the overall environmental impact of packaging.</p>
      
      <div className="optimized-factors">
        <h3>Optimized Factors</h3>
        <p>Optimized Weight: {weight} grams</p>
        <p>Optimized Height: {optimizedDimensions.newheight ? optimizedDimensions.newheight.toFixed(2) : height} cm</p>
        <p>Optimized Length: {optimizedDimensions.newlength ? optimizedDimensions.newlength.toFixed(2) : length} cm</p>
        <p>Optimized Width: {optimizedDimensions.newwidth ? optimizedDimensions.newwidth.toFixed(2) : width} cm</p>
        <p>Surface Area: {surfaceArea ? surfaceArea.toFixed(2) : 'N/A'} sq. cm</p>
        <p>Material Cost: {materialCost ? materialCost.toFixed(2) : 'N/A'} (unit: INR)</p>
      </div>
    </div>
  );
};

export default App;
