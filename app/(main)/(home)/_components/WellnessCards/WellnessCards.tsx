import { getCategories } from "@/services/category/category";
import WellnessCardsClient from "./WellnessCardsClient";


export default async function WellnessCards() {
  const res = await getCategories();
  console.log(res);

  if ("error" in res) {
    return null; // or error UI
  }

  return <WellnessCardsClient categories={res?.data} />;
}
