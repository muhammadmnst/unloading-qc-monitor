"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

export default function TVLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const theme = searchParams.get("theme") ?? "dark"
  const isDark = theme !== "light"

  const navLinks = [
    { href: `/tv/cpo?theme=${theme}`, label: "CPO" },
    { href: `/tv/pk?theme=${theme}`, label: "PK" },
    { href: `/tv/cangkang?theme=${theme}`, label: "Cangkang" },
  ]

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`px-6 py-3 flex items-center justify-between border-b ${
          isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-tight">
            📦 Unloading Monitor
          </span>
          <nav className="flex gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href.split("?")[0])
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-600 text-white"
                      : isDark
                      ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={`${pathname}?theme=${isDark ? "light" : "dark"}`}
            className={`px-3 py-1 rounded border text-xs ${
              isDark
                ? "border-gray-700 text-gray-400 hover:text-gray-100"
                : "border-gray-300 text-gray-500 hover:text-gray-900"
            }`}
          >
            {isDark ? "☀ Light" : "🌙 Dark"}
          </Link>
          <span className={isDark ? "text-gray-500" : "text-gray-400"}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
