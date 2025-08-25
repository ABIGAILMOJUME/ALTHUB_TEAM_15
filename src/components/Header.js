// src/components/Header.js
import React from 'react';
import { FaBars } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png'; // <-- 1. IMPORT the new logo

const Header = ({ onMenuClick }) => {
  return (
    <header className="mobile-header">
      {/* 2. REPLACE the h1 tag with an img tag */}
      <img src={logo} alt="BinIt Logo" className="mobile-logo-img" />
      <FaBars className="menu-icon" onClick={onMenuClick} />
    </header>
  );
};

export default Header;