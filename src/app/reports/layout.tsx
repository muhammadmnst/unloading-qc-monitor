import { auth } from "@/auth"
import Navbar from "@/components/Navbar"
import { redirect } from "next/navigation"

export default async function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const allowed = ["ADMIN", "QC", "OPERATIONAL"]
  if (!allowed.includes(session.user.role)) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        role={session.user.role}
        username={session.user.username}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
