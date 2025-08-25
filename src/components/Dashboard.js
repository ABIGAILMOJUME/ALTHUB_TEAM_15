// src/components/Dashboard.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// Data for the active state chart
const activeData = [
  { name: 'Jan', General: 280, Organic: 540, Recyclables: 180 },
  { name: 'Feb', Organic: 700, General: 280, Recyclables: 220 },
  // ... add data for other months as seen in the image
  { name: 'Dec', Organic: 520, General: 220, Recyclables: 150 },
];

const StatCard = ({ title, value, unit }) => (
  <div className="stat-card">
    <p className="stat-title">{title}</p>
    <h2 className="stat-value">{value} <span className="stat-unit">{unit}</span></h2>
  </div>
);

const Dashboard = ({ isEmpty }) => {
  const chartData = isEmpty ? [] : activeData;

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, Jessica</h2>
        <p>Track your impact, monitor community reports, and measure how your clean-up efforts are transforming your environment</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total waste disposed (kg)" value={isEmpty ? '0' : '20'} />
        <StatCard 
          title={isEmpty ? "No. of clean-up drives joined" : "Total Illegal Reports Logged"} 
          value={isEmpty ? '0' : '02'} 
        />
        <StatCard title="Coins Earned" value={isEmpty ? '0' : '12'} unit="coins" />
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Waste Disposal Trends Overtime</h3>
          <select defaultValue="2025" className="year-select">
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="General" stackId="a" fill="#A5D6A7" />
            <Bar dataKey="Organic" stackId="a" fill="#4CAF50" />
            <Bar dataKey="Recyclables" stackId="a" fill="#1B5E20" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Dashboard;