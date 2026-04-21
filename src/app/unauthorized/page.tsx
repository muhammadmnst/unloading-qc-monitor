import Link from "next/link"
import { ShieldX } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Akses Ditolak</h1>
          <p className="text-slate-400 mt-2">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
        <Link
          id="back-to-dashboard-link"
          href="/dashboard"
          className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
