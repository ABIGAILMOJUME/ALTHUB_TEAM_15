import {  useState } from "react";
import {  Calendar, Clock, Sparkles, History } from "lucide-react";

const Card = ({ children, onClick, className }) => (
  <div onClick={onClick} className={className}>
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-3">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={className}>{children}</h3>;
const CardContent = ({ children }) => <div className="px-6 pb-6">{children}</div>;

const CardGrid = ({ onCardClick }) => {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: 1,
      title: "Daily",
      description: "Pickup every day",
      amount: "₦300",
      icon: Calendar,
      gradient: "from-green-500 to-emerald-600",
      badge: "Most Popular"
    },
    {
      id: 2,
      title: "Weekly",
      description: "Pickup once a week",
      amount: "₦2800",
      icon: Clock,
      gradient: "from-yellow-500 to-amber-600",
      badge: "Best Value"
    },
    {
      id: 3,
      title: "Biweekly",
      description: "Pickup every 2 weeks",
      amount: "₦3400",
      icon: Calendar,
      gradient: "from-green-600 to-teal-600",
      badge: null
    },
    {
      id: 4,
      title: "Monthly",
      description: "Pickup once a month",
      amount: "₦4200",
      icon: Sparkles,
      gradient: "from-amber-500 to-yellow-600",
      badge: "Economical"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 w-full">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <Card
            key={option.id}
            onClick={() => {
              setSelected(option.id);
              if (onCardClick) onCardClick(option);
            }}
            className={`group relative cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 rounded-2xl overflow-hidden ${
              selected === option.id
                ? "ring-4 ring-green-500 ring-offset-2 dark:ring-offset-gray-900 shadow-2xl"
                : "shadow-lg hover:shadow-2xl"
            } bg-white dark:bg-gray-800 border-2 ${
              selected === option.id
                ? "border-green-500"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {/* Gradient Background Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Badge */}
            {option.badge && (
              <div className="absolute bottom-4 right-4 z-10">
                <span className={`bg-gradient-to-r ${option.gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                  {option.badge}
                </span>
              </div>
            )}

            {/* Selected Checkmark */}
            {selected === option.id && (
              <div className="absolute top-4 left-4 z-10">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {option.title}
                  </CardTitle>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${option.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-base">
                {option.description}
              </p>
              <div className="flex items-baseline gap-1">
                <p className={`text-3xl font-bold bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent`}>
                  {option.amount}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  per pickup
                </span>
              </div>
            </CardContent>

            {/* Hover Indicator */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
          </Card>
        );
      })}
    </div>
  );
};
export default CardGrid;