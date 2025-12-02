import StatesChart from "./StatesChart.tsx/StatesChart";
import StatesSection from "./StatesSection/StatesSection";

const OverviewPage = () => {
  return (
    <div className="bg-black p-5">
      <StatesSection />
      <StatesChart />
    </div>
  );
};

export default OverviewPage;
