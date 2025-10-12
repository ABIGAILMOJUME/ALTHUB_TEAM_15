import { useEffect } from "react";
import ConnectingLines from "../components/ConnectingLines.jsx";
import CardGrid from "../components/CardGrid.jsx";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/navigation.jsx";
import { ArrowRight } from "lucide-react";
import { useSchedule } from "../context/ScheduleContext";

const CreateSchedule = () => {
  const navigate = useNavigate();
  const { resetScheduleData, updateScheduleData } = useSchedule(); // Get updateScheduleData

  useEffect(() => {
    resetScheduleData();
  }, [resetScheduleData]);

  // Modify handleCardClick to accept the selected option
  const handleCardClick = (selectedOption) => {
    // Update the scheduleData context with the selected frequency
    updateScheduleData({ frequency: selectedOption.title });
    navigate("/dates");
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Create Regular Pickup Schedule
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Set up recurring waste collections that fit your routine.
              </p>
            </div>
            <button
              onClick={() => navigate("/pickup-history")}
               className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center shadow-md transition-transform transform hover:-translate-y-1 md:w-auto w-full"
            >
              Pickup History
            </button>
          </div>
          
          <ConnectingLines currentStep={1} onLineClick={handleLineClick} />

          <div className="mt-12">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  <span>Step 1 of 5</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700"></div>
              </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Collection Frequency
            </h2>
            <CardGrid onCardClick={handleCardClick} />
          </div>
          
          <div className="mt-12 flex justify-end">
            <button
              onClick={handleCardClick}
              className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateSchedule;
