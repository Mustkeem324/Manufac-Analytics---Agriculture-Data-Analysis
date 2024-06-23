// src/App.tsx
import React from 'react';
import './App.css';
import processData from './dataProcessor';

const App: React.FC = () => {
  const { yearlyProduction, cropAverages } = processData();

  return (
    <div className="container">
      <h1 className="title">Yearly Production Data</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Crop with Maximum Production</th>
            <th>Crop with Minimum Production</th>
          </tr>
        </thead>
        <tbody>
          {yearlyProduction.map((item, index) => (
            <tr key={index}>
              <td>{item.year}</td>
              <td>{item.maxCrop}</td>
              <td>{item.minCrop}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="subtitle">Crop Averages (1950-2020)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Average Yield (Kg/Ha)</th>
            <th>Average Cultivation Area (Ha)</th>
          </tr>
        </thead>
        <tbody>
          {cropAverages.map((item, index) => (
            <tr key={index}>
              <td>{item.crop}</td>
              <td>{item.avgYield}</td>
              <td>{item.avgArea}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
