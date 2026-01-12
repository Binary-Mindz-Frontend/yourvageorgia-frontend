import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
import { Suspense } from "react";
import MemberRegOtpClient from "./_components/MemberRegOtpClient";

const MemberRegOtpPage = () => {
    return (
        <Suspense fallback={<BeautifulLoader fullScreen text="Loading Verification" />}>
            <MemberRegOtpClient />
        </Suspense>
    );
};

export default MemberRegOtpPage;
