
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Middleware handles redirection to /profile if authenticated
  return (
    <>{children}</>
  )

}
