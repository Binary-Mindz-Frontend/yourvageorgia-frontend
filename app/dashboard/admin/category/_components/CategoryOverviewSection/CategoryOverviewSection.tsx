import { LayoutPanelTop  } from "lucide-react";
import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";


const baseAnalyticsData = {
    title: "Total Categories",
    icon: LayoutPanelTop,
    iconBg: "bg-[#DBEAFE]",
    iconColor: "text-[#155DFC]",
};

interface AnalyticsOverviewProps {
    totalCategory: number;
    loading: boolean;
}

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    iconBg: string;
    iconColor: string;
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({
    title,
    value,
    icon: Icon,
    iconBg,
    iconColor
}) => {
    return (
        <Card className="rounded-2xl shadow-sm border bg-[#1a1a1a] border-black p-5">
            <CardContent className="p-0">
                <div className="flex justify-between items-start">
                    {/* Left Text Section */}
                    <div>
                        <p className="text-white text-base font-normal">{title}</p>
                        <p className="text-white text-xl font-semibold mt-2 leading-snug">
                            {value}
                        </p>
                    </div>

                    {/* Icon */}
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
                    >
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const AnalyticsOverviewSection: FC<AnalyticsOverviewProps> = ({ totalCategory, loading }) => {

    const analyticsData = [
        {
            ...baseAnalyticsData,
            value: totalCategory, 
        },
    ];


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-6">
            {loading ? (
                // Display loading state when the data is being fetched
                <p className="text-white">Loading analytics...</p>
            ) : (
                // Map over the data and pass the values to the card
                analyticsData.map((item, idx) => (
                    <AnalyticsCard 
                        key={idx} 
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        iconBg={item.iconBg}
                        iconColor={item.iconColor}
                    />
                ))
            )}
        </div>
    );
};
export default AnalyticsOverviewSection;
