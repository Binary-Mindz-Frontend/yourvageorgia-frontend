import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Users, DollarSign, AlertCircle, LucideIcon } from "lucide-react";

// Static dashboard data
const dashboardData = [
  {
    title: "Total Partner",
    icon: Users,
    value: 8,
    status: "Clients + partners",
    color: "text-[#155DFC]", 
  },
  {
    title: "Active Partner",
    icon: UserCheck,
    value: 2,
    status: "Past 30 days",
    color: "text-[#9810FA]", 
  },
  {
    title: "Escrow Overview",
    icon: DollarSign,
    value: "$16,700",
    status: "Pending: $2,000 | Released: $10,600",
    color: "text-[#009966]", 
  },
  {
    title: "Compliance Pending",
    icon: AlertCircle,
    value: 7,
    status: "Incomplete verification",
    color: "text-[#F54900]", 
  },
];

// Reusable single card component
interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  status: string;
  color: string;
}

const DashboardCard: FC<DashboardCardProps> = ({ title, icon: Icon, value, status, color}) => {
  return (
    <Card className="rounded-2xl py-4 shadow-sm border bg-[#500202] border-[#500202]">
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-white">{title}</h2>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>

        <p className="text-2xl font-semibold text-white">{value}</p>
        <p className="text-xs text-gray-400">{status}</p>
      </CardContent>
    </Card>
  );
};

const UsersSummary: FC = () => {
  return (
    <div className="grid grid-cols-1 mt-3 mb-6 md:mt-8 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {dashboardData.map((item, index) => (
        <DashboardCard
          key={index}
          title={item.title}
          icon={item.icon}
          value={item.value}
          status={item.status}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default UsersSummary;
