
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import CreateSchedule from "../src/pages/CreateSchedule.jsx";
import Dates from "../src/pages/Dates.jsx";
import WasteTypes from "../src/pages/WasteTypes.jsx";
import SpecialRequirements from "../src/pages/SpecialRequirements.jsx";
import ServiceProvider from "../src/pages/ServiceProvider.jsx";
import Preview from "../src/pages/Preview.jsx";
import Select from "../src/pages/Select.jsx";
import Dashboard from './components/dashbord';
import SignUp from './components/signup';
import Login from './components/login';
import ForgotPassword from './components/forgotpassword';
import ScheduleSuccess from "./pages/ScheduleSuccess";
import BillPayment from "./pages/BillPayment";
import NotificationPreferencesPage from "./pages/Notification.jsx";
import IllegalDumping from "./components/illegalDumping";
import Report from './components/report';
import PaymentHistory from './pages/PaymentHistory';
import PickupHistory from './pages/PickupHistory';
import BinitPrivacyPolicy from './pages/BinitPrivacyPolicy';
import AccountSettings from './pages/AccountSettings';
import AuthCallback from './pages/AuthCallback';
import RegistrationSuccess from './pages/RegistrationSuccess';
import ErrorBoundary from './components/ErrorBoundary';


 function App () { 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 2 seconds for loading screen

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <RegistrationSuccess />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
     
         <Route path="/report" element={<IllegalDumping />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<SignUp />} />
         <Route path="/auth/callback" element={<AuthCallback />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/schedule" element={<CreateSchedule />} />
          <Route path="/dates" element={<Dates />} />
          <Route path="/waste" element={<WasteTypes />} />
          <Route path="/special" element={<SpecialRequirements />} />
          <Route path="/service" element={<ServiceProvider />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/select" element={<Select />} />
          <Route path="/success" element={<ScheduleSuccess/>} />
          <Route path="/bill-payment" element={<BillPayment/>} />
          <Route path="/notifications" element={<NotificationPreferencesPage/>} />
          <Route path="/history" element={<Report/>} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/pickup-history" element={<PickupHistory />} />
    <Route path="/privacy" element={<BinitPrivacyPolicy />} />
          
      </Routes>
      </ErrorBoundary>
    </Router>

  );
}

export default App;
