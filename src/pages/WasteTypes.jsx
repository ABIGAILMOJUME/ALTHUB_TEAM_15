import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoaderPinwheel, Trash2, Paintbrush, BatteryFull, ArrowLeft, ArrowRight } from "lucide-react";
import ConnectingLines from "../components/ConnectingLines.jsx";
import Sidebar from "../components/navigation.jsx";
import { useSchedule } from "../context/ScheduleContext";

const WasteTypes = () => {
  const { scheduleData, updateScheduleData } = useSchedule();
  const [selectedMeasurement, setSelectedMeasurement] = useState(scheduleData.volume || "");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const options = [
    {
      type: "General Waste",
      icon: <Trash2 className="w-6 h-6 text-gray-500" />,
      items: ["Regular Household trash"],
    },
    {
      type: "Recycling",
      icon: <LoaderPinwheel className="w-6 h-6 text-gray-500" />,
      items: ["Paper", "Plastic", "Glass", "Metal"],
    },
    {
      type: "Organic Waste",
      icon: <Paintbrush className="w-6 h-6 text-gray-500" />,
      items: ["Food scraps", "Garden waste"],
    },
    {
      type: "E-Waste",
      icon: <BatteryFull className="w-6 h-6 text-gray-500" />,
      items: ["Electronics", "Batteries"],
    },
  ];

  const [selected, setSelected] = useState(scheduleData.wasteType?.split(", ") || []);

  const validateForm = () => {
    const newErrors = {};

    if (selected.length === 0) {
      newErrors.wasteTypes = "Please select at least one waste type";
    }

    if (!selectedMeasurement) {
      newErrors.volume = "Please select expected volume";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const wasteData = {
        wasteType: selected.join(", "),
        volume: selectedMeasurement,
      };
      updateScheduleData(wasteData);
      navigate("/special");
    }
  };

  const toggleSelect = (type) => {
    setSelected((prev) => {
      const newSelected = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];

      if (newSelected.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, wasteTypes: undefined }));
      }

      return newSelected;
    });
  };

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

    return (
      <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <ConnectingLines currentStep={3} onLineClick={handleLineClick} />
            <div className="mt-12">
               <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  <span>Step 3 of 5</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                Waste Types (Select all that apply)
              </h2>
  
              <fieldset className="space-y-4">
                {options.map(({ type, icon, items }) => {
                  const isSelected = selected.includes(type);
                  return (
                    <div
                      key={type}
                      onClick={() => toggleSelect(type)}
                      className={`border rounded-lg p-4 flex items-center gap-4 transition cursor-pointer ${
                        isSelected
                          ? "border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/20 shadow-sm"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400"
                      }`}>
                                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                            {React.cloneElement(icon, { className: `w-6 h-6 ${isSelected ? 'text-green-600' : 'text-gray-500 dark:text-gray-300'}` })}
                                          </div>                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 dark:text-gray-100">{type}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {items.join(", ")}
                        </span>
                      </div>
                      <div className={`h-6 w-6 flex items-center justify-center rounded-full border-2 transition-colors flex-shrink-0 ${ isSelected ? "bg-green-600 border-green-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" }`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
                {errors.wasteTypes && (
                  <p className="mt-2 text-sm text-red-600">{errors.wasteTypes}</p>
                )}
              </fieldset>
  
              <div className="mt-8">
                <label className="block mb-2 text-base font-medium text-gray-700 dark:text-gray-200">Expected Volume</label>
                <select
                  value={selectedMeasurement}
                  onChange={(e) => {
                    setSelectedMeasurement(e.target.value);
                    setErrors((prev) => ({ ...prev, volume: undefined }));
                  }}
                  className={`border rounded-lg px-4 py-3 w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${errors.volume ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}>
                  <option value="">Select size</option>
                  <option value="small">Small (1-2 Bags)</option>
                  <option value="medium">Medium (3-5 Bags)</option>
                  <option value="large">Large (6-8 Bags)</option>
                </select>
                {errors.volume && (
                  <p className="mt-1 text-red-600 text-sm">{errors.volume}</p>
                )}
              </div>
            </div>
  
            <div className="mt-12 flex justify-between">
              <button
                onClick={() => navigate("/dates")}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };
export default WasteTypes;