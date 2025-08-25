// src/App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import './App.css';

function App() {
  // State to toggle between empty and active dashboard
  const [isDashboardEmpty, setIsDashboardEmpty] = useState(true);
  
  // State for mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* The Header is only for mobile view, controlled by CSS */}
      <Header onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />

      {/* The 'open' class will be used to show the sidebar on mobile */}
      <div className={`sidebar-container ${isMenuOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>

      <div className="main-content">
        {/* Simple toggle button to switch dashboard states for demonstration */}
        <div className="state-toggle">
          <p>Demo:</p>
          <button onClick={() => setIsDashboardEmpty(true)} disabled={isDashboardEmpty}>
            Show Empty State
          </button>
          <button onClick={() => setIsDashboardEmpty(false)} disabled={!isDashboardEmpty}>
            Show Active State
          </button>
        </div>
        <Dashboard isEmpty={isDashboardEmpty} />
      </div>
    </div>
  );
}

export default App;