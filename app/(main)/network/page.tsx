import { Suspense } from "react";
import NetworkFilter from "./_components/NetworkFilter/NetworkFilter";


const NetworkPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NetworkFilter />
    </Suspense>
  )
}

export default NetworkPage;