import { getCurrentUser } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  const m = await getCurrentUser()

  if (m) {
    return redirect("/profile")
  }

    return (
      <>{children}</>
    )

}
