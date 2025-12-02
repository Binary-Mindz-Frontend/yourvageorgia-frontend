import UsersSummary from "./_components/UsersSummarySection/UsersSummary";
import UserTable from "./_components/PartnerTable/PartnerTable";


export default function Partners() {
  return (
    <div className="bg-black p-5">
      <UsersSummary />
      <UserTable />
    </div>
  );
}
