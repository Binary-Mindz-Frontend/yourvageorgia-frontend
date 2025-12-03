import { TopCard } from "../../../data/overviewData";

const DashboardCard = ({ title, value, icon }: TopCard) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex-1 min-w-[200px] flex flex-col items-center gap-2">
    <span className="text-xl text-gray-700">{icon}</span>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);
export default DashboardCard;
