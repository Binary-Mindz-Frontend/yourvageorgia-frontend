import { Suspense } from "react";
import NetworkFilter from "./_components/NetworkFilter/NetworkFilter";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";


const NetworkPage = () => {
  return (
    <Suspense fallback={<BeautifulLoader fullScreen text="Loading Network" />}>
      <NetworkFilter />
    </Suspense>
  )
}

export default NetworkPage;