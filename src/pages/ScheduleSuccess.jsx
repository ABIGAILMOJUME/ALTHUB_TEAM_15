import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/navigation.jsx";
import ConnectingLines from "../components/ConnectingLines.jsx";
import apiFetch from "../lib/api.js";
import { useSchedule } from "../context/ScheduleContext";
import { Check, Loader2, Calendar, MapPin, Clock, Package, Star, CreditCard, AlertCircle, Sparkles } from "lucide-react";


const ScheduleSuccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { scheduleData } = useSchedule();

  const handleLineClick = (step) => {
    switch (step) {
      case 1:
        navigate("/schedule");
        break;
      case 2:
        navigate("/dates");
        break;
      case 3:
        navigate("/waste");
        break;
      case 4:
        navigate("/special");
        break;
      case 5:
        navigate("/success");
        break;
      default:
        break;
    }
  };

  if (!scheduleData) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">Missing schedule information</p>
                    <p className="text-gray-600 mt-2">It seems some data is missing. Please go back and start over.</p>
                    <button
                        onClick={() => navigate("/schedule")}
                        className="mt-6 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                    >
                        <span>Start Over</span>
                    </button>
                </div>
            </main>
        </div>
    );
  }

  const {
    frequency,
    timeWindow,
    startDate,
    location: address,
    wasteType,
    volume,
    specialRequirements,
    company,
  } = scheduleData;

   const parseCurrency = (currencyString) => {
    if (typeof currencyString !== 'string') return 0;
    return Number(currencyString.replace(/[^0-9.-]+/g,""));
  }

  const formatNextPickup = (startDate, timeWindow) => {
    if (!startDate || !timeWindow) {
      return "Not specified";
    }

    // Create a date object. Add T00:00:00 to avoid timezone issues.
    const date = new Date(`${startDate}T00:00:00`);
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    // Extract start time from time window, e.g., "Morning (8 AM - 12 PM)" -> "8 AM"
    const timeMatch = timeWindow.match(/\(([^)]+)\)/);
    const time = timeMatch ? timeMatch[1].split(' - ')[0] : timeWindow;

    return `${formattedDate} at ${time}`;
  };

  const scheduleName = `${frequency} ${wasteType} Collection`;
  const nextPickup = formatNextPickup(startDate, timeWindow);
  const monthlyCost =  parseCurrency(company?.price || "0");

  const handlePayment = async () => {
    const formatFrequency = (freq) => {
      if (!freq) return 'daily';
      const lowerCaseFreq = freq.toLowerCase();
      if (lowerCaseFreq.includes('one-time')) return 'one_time';
      if (lowerCaseFreq.includes('bi-weekly')) return 'bi_weekly';
      if (lowerCaseFreq.includes('weekly')) return 'weekly';
      if (lowerCaseFreq.includes('monthly')) return 'monthly';
      if (lowerCaseFreq.includes('daily')) return 'daily';
      return 'daily';
    };

    const classifyWasteType = (wasteType) => {
      if (!wasteType || wasteType.length === 0) {
        return 'mixed';
      }

      if (Array.isArray(wasteType) && wasteType.length > 1) {
        return 'mixed';
      }

      const type = Array.isArray(wasteType) ? wasteType[0] : wasteType;
      const lowerCaseType = type.toLowerCase();

      if (lowerCaseType.includes('general')) {
        return 'mixed';
      }
      if (lowerCaseType.includes('organic')) {
        return 'organic';
      }
      if (lowerCaseType.includes('recycling')) {
        return 'plastic';
      }
      if (lowerCaseType.includes('e-waste')) {
        return 'electronic';
      }
      if (lowerCaseType.includes('glass')) {
        return 'glass';
      }
      if (lowerCaseType.includes('metal')) {
        return 'metal';
      }

      return 'mixed';
    };

    const priceString = company?.price || '0';
    const numericPrice = parseFloat(priceString.replace(/[^\d.-]/g, '')) || 0;

    const pickupData = {
      location: address || "",
      waste_type: classifyWasteType(wasteType),
      frequency: formatFrequency(frequency),
      schedule_name: scheduleName || "",
      expected_volume: volume || "",
      monthly_cost: numericPrice,
      special_requirements: specialRequirements?.join(", ") || "",
      service_provider: company?.name || "",
      time_window: timeWindow || "",
      scheduled_date: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      image_path: "",
    };

    setIsLoading(true);
    try {
      const response = await apiFetch("https://binit-1fpv.onrender.com/pickup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pickupData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Pickup scheduled successfully:", result);
      } else {
        console.error("Failed to schedule pickup:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error scheduling pickup:", error);
    } finally {
      setIsLoading(false);
      navigate("/bill-payment");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 pt-20 p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <ConnectingLines currentStep={5} onLineClick={handleLineClick} />

        {/* Success Header */}
          <div className="text-center mb-10 mt-4">
            <div className="flex items-center gap-3 justify-center mb-6">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                <span>Step 5 of 5: Confirmation</span>
              </div>
            </div>

            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-17 h-17 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 dark:from-gray-100 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
              Schedule Created Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Your recurring waste pickup is now active and ready to go
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Next Pickup: <span className="font-medium">{nextPickup}</span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800  items-center rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Schedule Details
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Schedule Name:</span>
                <span className="text-gray-800 dark:text-white">{scheduleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Waste Type:</span>
                <span className="text-gray-800 dark:text-white">{wasteType || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Expected Volume:</span>
                <span className="text-gray-800 dark:text-white">{volume || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Location:</span>
                <span className="text-gray-800 dark:text-white">{address || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Frequency:</span>
                <span className="text-gray-800 dark:text-white">{frequency || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Time Window:</span>
                <span className="text-gray-800 dark:text-white">{timeWindow || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Start Date:</span>
                <span className="text-gray-800 dark:text-white">{startDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Special Requirements:</span>
                <span className="text-gray-800 dark:text-white">{specialRequirements?.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Service Provider:</span>
                <span className="text-gray-800 dark:text-white">{company?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Monthly Cost:</span>
                <span className="text-gray-800 dark:text-white font-bold">{monthlyCost}</span>
              </div>
            </div>
          </div>

         {/* Payment Button */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  <span className="relative z-10">Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Continue to Payment & Billing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleSuccess;
