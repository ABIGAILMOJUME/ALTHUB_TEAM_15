// src/components/Sidebar.js
import React from 'react';
import { FaChartBar, FaTruck, FaQuestionCircle, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';
import profilePic from './jessica-diop.png';
import logo from '../assets/logo.png'; // <-- 1. IMPORT the new logo

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        
        <img src={logo} alt="BinIt Logo" className="logo-img" />
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <ul className="menu-items">
        <li className="menu-item active">
          <FaChartBar />
          <span>Dashboard</span>
        </li>
        <li className="menu-item">
          <FaTruck />
          <span>Schedule Pickup</span>
        </li>
        <li className="menu-item">
          <FaQuestionCircle />
          <span>Report Illegal Dump</span>
        </li>
      </ul>

      <div className="user-profile">
        <img src={profilePic} alt="Jessica Diop" className="profile-pic" />
        <div className="user-details">
          <p className="user-name">Jessica Diop</p>
          <p className="user-email">jess24@gmail.com</p>
        </div>
        <FaSignOutAlt className="logout-icon" />
      </div>
    </nav>
  );
};

export default Sidebar;