import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";
export default async function AdminPage() {
    const user = await getCurrentUser();
    if (!user) {
        return redirect("/dashboard/admin/login")
    } else {
        return redirect("/dashboard/admin/overview")
    }
    return (
        <BeautifulLoader size="sm" text="Redirecting..." />
    )
}
