const ConnectingLines = ({ currentStep, onLineClick }) => {
  const steps = [
    { number: 1, label: "Step 1" },
    { number: 2, label: "Step 2" },
    { number: 3, label: "Step 3" },
    { number: 4, label: "Step 4" },
    { number: 5, label: "Step 5" }
  ];

  return (
    <div className="w-full overflow-x-auto py-3 " >
      <div className="flex items-center justify-between min-w-full px-4 sm:px-0">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1 ml-2 mr-2 last:mr-0">
              {/* Step Container */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Circle */}
                <div
                  className={`relative flex items-center justify-center rounded-full font-semibold cursor-pointer transition-all duration-300 shadow-lg
                    ${isActive 
                      ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110 ring-4 ring-green-200 dark:ring-green-900' 
                      : isCompleted
                      ? 'w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-700 dark:text-green-300'
                      : 'w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                    ${!isActive && 'hover:scale-105 hover:shadow-xl'}
                  `}
                  onClick={() => onLineClick(step.number)}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-sm sm:text-base ${isActive ? 'text-lg sm:text-xl font-bold' : ''}`}>
                      {step.number}
                    </span>
                  )}
                  
                  {/* Active pulse effect */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></span>
                  )}
                </div>

                {/* Label */}
                <span className={`mt-2 text-xs sm:text-sm font-medium text-center max-w-[60px] sm:max-w-none leading-tight transition-colors duration-300
                  ${isActive 
                    ? 'text-green-600 dark:text-green-400 font-semibold' 
                    : isCompleted
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 sm:mx-5 rounded-full relative group cursor-pointer"
                  onClick={() => onLineClick(step.number + 0.5)}
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-500
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `}></div>
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectingLines;