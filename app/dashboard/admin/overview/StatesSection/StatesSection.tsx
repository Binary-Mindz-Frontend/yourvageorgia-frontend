import {
	Users,
	Activity,
	DollarSign,
	Clock,
	AlertCircle,
} from "lucide-react";
import StateCard from "../_components/StateCard";

const stats = [
  {
    icon: Users,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Total Partners",
    value: "2,847",
    change: "12.5%",
    changeType: "increase",
  },
  {
    icon: Activity,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "Active (30 days)",
    value: "3,421",
    change: "15.2%",
    changeType: "increase",
  },
  {
    icon: DollarSign,
    iconBgColor: "bg-teal-100",
    iconColor: "text-teal-600",
    title: "Escrow Total Funds",
    value: "$487,320",
    change: "5.4%",
    changeType: "increase",
  },
  {
    icon: Clock,
    iconBgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Pending Release",
    value: "$142,850",
    change: "5.4%",
    changeType: "increase",
  },
  {
    icon: AlertCircle,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600",
    title: "Disputes Open",
    value: "23",
    change: "5.4%",
    changeType: "decrease",
  },
] as const; 


const StatesSection = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-2 pb-7 pt-3 sm:pt-8 ">
			{stats.map((stat, index) => (
				<StateCard key={index} {...stat} />
			))}
		</div>
	);
};

export default StatesSection;
