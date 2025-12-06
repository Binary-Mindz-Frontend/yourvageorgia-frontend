const DashboardSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex-1 flex flex-col">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    {children}
  </div>
);
export default DashboardSection;
