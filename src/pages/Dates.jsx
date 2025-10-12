import { ArrowLeft, ArrowRight } from "lucide-react";
import ConnectingLines from "../components/ConnectingLines.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/navigation.jsx";
import { useSchedule } from "../context/ScheduleContext";
import { Calendar, Clock, MapPin, Sparkles, AlertCircle } from "lucide-react";

const Dates = () => {
  const navigate = useNavigate();
  const { scheduleData, updateScheduleData } = useSchedule();

  const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNameMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  const dayMessages = {
    Monday: "Monday starts the work week fresh!",
    Tuesday: "Tuesday is productive and steady.",
    Wednesday: "Wednesdays have the best availability and pricing!",
    Thursday: "Thursday is almost the weekend.",
    Friday: "Friday means fun is near!",
    Saturday: "Saturday is perfect for adventures.",
    Sunday: "Sunday is a great day to relax.",
  };
  const times = [
    "Morning (8 AM - 12 PM)",
    "Afternoon (12 PM - 4 PM)",
    "Evening (4 PM - 8 PM)",
    "Night (8 PM - 12 AM)",
  ];

  const [selectedDay, setSelectedDay] = useState(scheduleData.selectedDay || "");
  const [checked, setChecked] = useState(scheduleData.isWednesdaySpecial || false);
  const [selectedTime, setSelectedTime] = useState(scheduleData.timeWindow || "");
  const [selectedDate, setSelectedDate] = useState(scheduleData.startDate || "");
  const [address, setAddress] = useState(scheduleData.location || "");
  const [errors, setErrors] = useState({});
  const [dayMismatchError, setDayMismatchError] = useState("");

  useEffect(() => {
    if (selectedDay && selectedDate) {
        // Append 'Z' to ensure the date is parsed as UTC. This prevents timezone-related off-by-one errors.
        const date = new Date(selectedDate + 'T00:00:00Z');
        const dateDay = date.getUTCDay(); // 0 for Sunday, 1 for Monday, etc.
        const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        
        if (dayMap[selectedDay] !== dateDay) {
            const startDateDayName = Object.keys(dayMap).find(key => dayMap[key] === dateDay);
            const selectedDayFullName = dayNameMap[selectedDay];
            const startDateFullName = dayNameMap[startDateDayName];
            setDayMismatchError(`Collection day (${selectedDayFullName}) does not match the start date's day (${startDateFullName}).`);
        } else {
            setDayMismatchError("");
        }
    } else {
        setDayMismatchError("");
    }
}, [selectedDay, selectedDate, dayNameMap]);

  const validateForm = () => {
    const newErrors = {};

    const hasValidDay = checked || selectedDay;
    if (!hasValidDay) {
      newErrors.day = "Please select a collection day";
    }

    if (!selectedTime) {
      newErrors.time = "Please select a preferred time window";
    }

    if (!selectedDate) {
      newErrors.date = "Please select a start date";
    }

    if (!address.trim()) {
      newErrors.address = "Please enter a collection address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (newChecked) {
      setSelectedDay("Wed");
    } else {
      setSelectedDay("");
    }

    setErrors((prev) => ({ ...prev, day: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if (!isFormValid || dayMismatchError) {
        return;
    }

    const frequency = checked
      ? "Every Wednesday"
      : `Every ${dayNameMap[selectedDay]}`;
    const stepData = {
      selectedDay: checked ? "Wed" : selectedDay,
      frequency,
      timeWindow: selectedTime,
      startDate: selectedDate,
      location: address.trim(),
      isWednesdaySpecial: checked,
      completedAt: new Date().toISOString(),
    };

    updateScheduleData(stepData);
    navigate("/waste");
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

        <main className="flex-1 pt-20 p-6 md:p-8 lg:p-12 overflow-y-auto">

          <div className="max-w-4xl mx-auto">

            <ConnectingLines currentStep={2} onLineClick={handleLineClick} />
          
             
            <div className="mb-8 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  <span>Step 2 of 5</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Schedule Your Pickup
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-14">
                Choose your preferred collection day, time, and location
              </p>
            </div>

            <div className="space-y-4">
              {/* Collection Days */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Collection Day
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-2">
                  {allDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (!checked) {
                          setSelectedDay(day);
                          setErrors((prev) => ({ ...prev, day: undefined }));
                        }
                      }}
                      className={`group relative px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        selectedDay === day
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-500 shadow-lg scale-105"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-green-500 hover:shadow-md"
                      } ${
                        checked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                      }`}
                      disabled={checked}
                    >
                      {selectedDay !== day && !checked && (
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                      <span className="relative z-10">{day}</span>
                    </button>
                  ))}
                </div>
                
                {errors.day && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.day}</p>
                  </div>
                )}
                
                {dayMismatchError && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{dayMismatchError}</p>
                  </div>
                )}
                
                <label className="flex items-center gap-3 mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-amber-600 rounded border-amber-300 dark:border-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-semibold text-amber-900 dark:text-amber-200">
                      Special Wednesday Offer - Best Rates!
                    </span>
                  </div>
                </label>
                
                {selectedDay && !dayMismatchError && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      ✓ {dayMessages[dayNameMap[selectedDay]]}
                    </p>
                  </div>
                )}
              </div>

              {/* Time Window */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Preferred Time Window
                  </label>
                </div>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      setErrors((prev) => ({ ...prev, time: undefined }));
                    }}
                    className={`appearance-none border-2 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium transition-all duration-200 ${
                      errors.time ? "border-red-500" : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                    }`}
                  >
                    <option value="">-- Choose a time window --</option>
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.time && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.time}</p>
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Start Date
                  </label>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                  className={`border-2 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium transition-all duration-200 ${
                    errors.date ? "border-red-500" : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                  }`}
                />
                {errors.date && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                  </div>
                )}
              </div>

              {/* Collection Address */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Collection Address
                  </label>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  placeholder="Enter your full address"
                  className={`border-2 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 dark:placeholder-gray-400 font-medium transition-all duration-200 ${
                    errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                  }`}
                />
                {errors.address && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between gap-4">
            <button
              className="group relative bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-3 px-6 rounded-xl flex items-center gap-2 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="relative z-10">Back</span>
            </button>
            <button
              onClick={handleSubmit}
              className="group relative bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10">Next Step</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
      
      </main>
    </div>
  );
};

export default Dates;