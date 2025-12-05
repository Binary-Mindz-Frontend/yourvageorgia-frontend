import AddPartnerPage from "../../page";

export default async function EditPartnerPageRoute({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return <AddPartnerPage partnerId={id} />;
}