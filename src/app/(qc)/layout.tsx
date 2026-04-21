import { auth } from "@/auth"
import Navbar from "@/components/Navbar"

export default async function QCLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        role={session?.user?.role}
        username={session?.user?.username}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
