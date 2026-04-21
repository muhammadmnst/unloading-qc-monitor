"use client"

import { useState } from "react"
import { changePassword } from "../../auth-actions"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await changePassword(formData)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => router.push("/"), 2000)
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengubah password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-md">
      <div className="border rounded-lg shadow-sm bg-card text-card-foreground p-6">
        <h1 className="text-2xl font-bold mb-6">Reset / Ganti Password</h1>
        
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200 text-sm">
            Password berhasil diubah! Mengalihkan...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Password Baru</label>
            <input 
              name="newPassword" 
              type="password" 
              required 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Konfirmasi Password Baru</label>
            <input 
              name="confirmPassword" 
              type="password" 
              required 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-muted h-10 px-4 py-2 flex-1"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 flex-1 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
