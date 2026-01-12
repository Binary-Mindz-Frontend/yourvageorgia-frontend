import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { Suspense } from "react";
import PartnerDetails from "./_components/PartnerDetails";

export default async function PartnerDetailsPage({
    params
}: {
    params: Promise<{ partnerId: string }>
}) {
    const { partnerId } = await params;
    return (
        <Suspense fallback={<BeautifulLoader fullScreen text="Loading Partner Details" />}>
            <PartnerDetails partnerId={partnerId} />
        </Suspense>
    );
}
