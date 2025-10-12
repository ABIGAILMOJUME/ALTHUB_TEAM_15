import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from "../context/UserContext";
import apiFetch from "../lib/api";
import { useNavigate } from "react-router-dom";

const StatCard = ({ title, value, unit, loading }) => (
  <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
    {loading ? (
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
    ) : (
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
        {value}
        {unit && <span className="text-lg font-medium text-gray-500 dark:text-gray-400 ml-2">{unit}</span>}
      </h2>
    )}
  </div>
);

const processPickupData = (pickups) => {
  const monthlyData = {};
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  for (const pickup of pickups) {
    const date = new Date(pickup.created_at);
    const monthKey = date.toISOString().substring(0, 7); // "YYYY-MM"

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthNames[date.getMonth()],
        organic: 0,
        plastic: 0,
        electronic: 0, // This key maps to the 'General' bar in the chart
      };
    }

    const wasteType = pickup.waste_type.toLowerCase();

    if (wasteType === 'organic') {
      monthlyData[monthKey].organic += 1;
    } else if (wasteType === 'plastic' || wasteType === 'recycling') {
      monthlyData[monthKey].plastic += 1;
    } else {
      // Grouping general, mixed, electronic, etc. into one bar.
      monthlyData[monthKey].electronic += 1;
    }
  }

  return Object.values(monthlyData);
};

const isDashboardDataEmpty = (data) => {
  if (!data) return true;

  if (data.total_waste_disposed_kg !== 0) return false;
  if (data.total_illegal_reports !== 0) return false;
  if (data.total_coins_earned !== 0) return false;

  if (!data.monthly_waste_data || data.monthly_waste_data.length === 0) return true;

  for (const monthData of data.monthly_waste_data) {
    if (monthData.organic_waste !== 0) return false;
    if (monthData.general_waste !== 0) return false;
    if (monthData.e_waste !== 0) return false;
    if (monthData.recycling !== 0) return false;
  }

  return true;
};

const Dashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const firstName = user?.name?.split(' ')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('https://binit-1fpv.onrender.com/dashboard/stats');
        
        if (response.ok) {
          const data = await response.json();
          // Check if data is considered valid/not empty
          if (data && !isDashboardDataEmpty(data)) { // Modified condition
            setStats(data);
            return;
          }
        }
        
        // Fallback if the primary endpoint fails or returns empty data
        console.log("Primary stats endpoint failed or is empty. Using fallback.");
        const [pickupResponse, reportResponse] = await Promise.all([
          apiFetch('https://binit-1fpv.onrender.com/pickup/'),
          apiFetch('https://binit-1fpv.onrender.com/report')
        ]);

        let pickups = [];
        if (pickupResponse.ok) {
          const pickupData = await pickupResponse.json();
          pickups = Array.isArray(pickupData) ? pickupData : [pickupData];
        } else {
          console.error("Failed to fetch fallback pickup stats");
        }

        let total_illegal_reports = 0;
        let total_coins_earned = 0;
        if (reportResponse.ok) {
          const reportData = await reportResponse.json();
          if (Array.isArray(reportData)) {
            total_illegal_reports = reportData.length;
            total_coins_earned = Math.floor(reportData.length / 2);
          }
        } else {
          console.error("Failed to fetch fallback report stats");
        }

        const fallbackStats = {
          total_waste_disposed_kg: pickups.length, // Total number of pickups
          total_illegal_reports,
          total_coins_earned,
          monthly_waste_data: processPickupData(pickups),
        };
        setStats(fallbackStats);

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = useMemo(() => {
    if (!stats?.monthly_waste_data) return [];
    return stats.monthly_waste_data.map(monthData => ({
      name: monthData.month.substring(0, 3),
      Organic: monthData.organic,
      Recyclables: monthData.plastic,
      General: monthData.electronic,
    }));
  }, [stats]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 pt-20 p-4 md:p-8 overflow-y-auto w-full h-screen">
        <main className="p-0">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl text-gray-800 dark:text-gray-100 font-medium mb-1">Welcome back, {firstName || 'User'}</h2>
              <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl">
                Track your impact, monitor community reports, and measure how your clean-up efforts are transforming your environment
              </p>
            </div>
            <button onClick={() => navigate('/payment-history')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center shadow-md transition-transform transform hover:-translate-y-1 md:w-auto w-full">
              Payment History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
            <StatCard title="Total Number of PickUps" value={stats?.total_waste_disposed_kg ?? 0} loading={loading} />
            <StatCard title="Total Illegal Reports Logged" value={stats?.total_illegal_reports ?? 0} loading={loading} />
            <StatCard title="Coins Earned" value={stats?.total_coins_earned ?? 0} unit="coins" loading={loading} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Waste Disposal Trends Overtime</h3>
              <select defaultValue="2025" className="p-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-gray-100">
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              {loading ? (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
