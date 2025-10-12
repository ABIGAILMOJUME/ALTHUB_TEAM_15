import React from 'react';
import binitLogo from '../assets/binitLogo.svg';
import './RegistrationSuccess.css';

const RegistrationSuccess = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative">
      <div className="logo-container">
        <img src={binitLogo} alt="Binit Logo" className="logo" />
      </div>
      <p className="caption">See It, Bin It</p>
      <div className="loading-bar-container">
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
