"use client"
import { FC, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Users, LucideIcon } from "lucide-react";
import { getPartners } from "@/services/partner/partner";
import { Partner } from "@/types/partner.types";

// Reusable single card component
interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  status: string;
  color: string;
}

const DashboardCard: FC<DashboardCardProps> = ({ title, icon: Icon, value, status, color }) => {
  return (
    <Card className="rounded-2xl py-4 shadow-sm border bg-slate-900 border-black">
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
  const [partners, setPartners] = useState<Partner[]>([]); 
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true); 
      const result = await getPartners();
      if ("data" in result) {
        setPartners(result.data); 
      }
      setLoading(false); 
    };

    fetchPartners();
  }, []); 

  const totalPartners = partners.length;
  const featuredPartners = partners.filter((partner) => partner.isFeatured).length;

  // Static dashboard data with fetched values
  const dashboardData = [
    {
      title: "Total Partner",
      icon: Users,
      value: totalPartners,
      status: "Clients + partners",
      color: "text-[#155DFC]",
    },
    {
      title: "Featured Partner",
      icon: UserCheck,
      value: featuredPartners,
      status: "Featured Partners",
      color: "text-[#9810FA]",
    },
  ];

  return (
    <div className="grid grid-cols-1 mt-3 mb-6 md:mt-8 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        dashboardData.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            value={item.value}
            status={item.status}
            color={item.color}
          />
        ))
      )}
    </div>
  );
};

export default UsersSummary;
