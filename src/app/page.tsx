import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const role = session.user.role
  const username = session.user.username

  // Universal Landing Page
  redirect("/executive-summary")

  const cards = [
    {
      title: "Pendaftaran Kendaraan",
      description: "Input data QC untuk CPO, PK, dan Cangkang.",
      href: "/register",
      roles: ["QC", "ADMIN"],
      icon: "📋"
    },
    {
      title: "Executive Summary",
      description: "Lihat KPI dan status outspec material harian secara keseluruhan.",
      href: "/executive-summary",
      roles: ["QC", "OPERATIONAL", "ADMIN"],
      icon: "📈"
    },
    {
      title: "Monitoring Dashboard",
      description: "Pantau dan kelola antrean bongkar kendaraan secara terperinci.",
      href: "/dashboard/cpo",
      roles: ["QC", "OPERATIONAL", "ADMIN"],
      icon: "📊"
    },
    {
      title: "Public TV Display",
      description: "Tampilan khusus layar lebar untuk Smart TV.",
      href: "/tv",
      roles: ["QC", "OPERATIONAL", "ADMIN"],
      icon: "📺"
    },
    {
      title: "Operational Reports",
      description: "Analisis throughput dan dwell-time management.",
      href: "/reports",
      roles: ["ADMIN", "QC", "OPERATIONAL"],
      icon: "📈"
    },
    {
      title: "User Management",
      description: "Kelola akses dan peranan pengguna grup.",
      href: "/admin/users",
      roles: ["ADMIN"],
      icon: "👥"
    }
  ]

  const allowedCards = cards.filter(card => card.roles.includes(role))

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Selamat datang, <span className="text-primary">{username}</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-2 uppercase tracking-widest font-medium">
          Role: {role}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allowedCards.map((card) => (
          <Link 
            key={card.href}
            href={card.href}
            className="group block p-6 h-full rounded-2xl border bg-card hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform-gpu">
              {card.icon}
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {card.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-dashed text-center">
        <p className="text-sm text-muted-foreground italic">
          "Operational excellence starts with real-time data visibility."
        </p>
      </div>
    </div>
  )
}

