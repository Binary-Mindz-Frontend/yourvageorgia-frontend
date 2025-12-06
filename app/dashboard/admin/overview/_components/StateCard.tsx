import React from "react";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

interface StateCardProps {
  icon?: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  value: string | number;
  change?: string | number | null;
  changeType?: "increase" | "decrease";
}

const StateCard: React.FC<StateCardProps> = ({
  icon: IconComponent = Users,
  iconBgColor = "bg-white/20",   // translucent white looks good on orange
  iconColor = "text-white",
  title,
  value,
  change,
  changeType = "increase",
}) => {
  const isIncrease = changeType === "increase";
  const changeColor = isIncrease ? "text-green-100" : "text-red-100";  
  const TrendIcon = isIncrease ? TrendingUp : TrendingDown;

  return (
    <div className="space-y-3 bg-[#1a1a1a] rounded-xl p-6 border border-transparent shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`${iconBgColor} rounded-xl w-12 h-12 flex items-center justify-center`}>
          <IconComponent size={20} className={iconColor} />
        </div>

        {change && (
          <div className={`${changeColor} flex items-center gap-1 text-sm font-semibold`}>
            <TrendIcon size={16} />
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-white text-base font-normal">{title}</p>
        <p className="text-white text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StateCard;
