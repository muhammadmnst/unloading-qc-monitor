"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const tabs = [
    { href: "/dashboard/cpo", label: "Monitoring CPO" },
    { href: "/dashboard/pk", label: "Monitoring PK" },
    { href: "/dashboard/cangkang", label: "Monitoring Cangkang" },
  ]

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end border-b pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status Operasional</h1>
          <p className="text-muted-foreground mt-1">Pantau kendaraan bongkar (Polling aktual 10s)</p>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
            return (
              <Link 
                key={tab.href}
                href={tab.href} 
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none whitespace-nowrap
                  ${isActive ? 'border-primary text-primary' : 'border-transparent hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {children}
    </div>
  )
}
