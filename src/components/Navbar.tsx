"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserRole } from "@prisma/client"
import { LogOut } from "lucide-react"
import { logout } from "@/app/auth-actions"

type Props = {
  role?: UserRole | undefined
  username?: string | undefined
}

export default function Navbar({ role, username }: Props) {
  const pathname = usePathname()

  const links = [
    { href: "/executive-summary", label: "Executive Summary", roles: ["QC", "OPERATIONAL", "ADMIN"] },
    { href: "/register", label: "Pendaftaran", roles: ["QC", "ADMIN"] },
    { href: "/dashboard/cpo", label: "Monitoring", roles: ["QC", "OPERATIONAL", "ADMIN"] },
    { href: "/admin/users", label: "Users", roles: ["ADMIN"] },
    { href: "/reports", label: "Reports", roles: ["ADMIN", "QC", "OPERATIONAL"] },
    { href: "/tv", label: "TV Display", roles: ["QC", "OPERATIONAL", "ADMIN"] },
  ]

  const activeLinks = links.filter(link => !link.roles || (role && link.roles.includes(role)))

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight">
            QC Monitor
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {activeLinks.map(link => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold">{username}</span>
            <span className="text-[10px] text-muted-foreground uppercase">{role}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-bold text-primary">
            {username?.charAt(0).toUpperCase()}
          </div>
          <Link
            href="/settings/password"
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors group"
            title="Ganti / Reset Password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5"/></svg>
          </Link>
          <button
            onClick={() => logout()}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors group"
            title="Selesai Shift / Logout"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  )
}

