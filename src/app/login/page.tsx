"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Monitor } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    console.log("Submitting login form...")

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      console.log("SignIn result:", result)
      setLoading(false)

      if (result?.error) {
        setError(`Login gagal: ${result.error === "CredentialsSignin" ? "Username atau password salah" : result.error}`)
      } else {
        console.log("Login successful, hard redirecting...")
        // Gunakan window.location agar cookie diproses bersih oleh browser
        window.location.href = "/executive-summary"
      }
    } catch (err: any) {
      console.error("LOGIN_CATCH_ERROR:", err)
      setLoading(false)
      const msg = err.message || "Unknown Connection Error"
      setError("Kesalahan Jaringan: " + msg)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear scale-105"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      
      {/* Sophisticated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-emerald-950/90 backdrop-blur-[2px]" />
      
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-7000 delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-8 flex justify-center w-full animate-fade-in-down">
          <div className="p-4">
            <img 
              src="/logo.png" 
              alt="KPN CORP Logo" 
              className="h-24 md:h-32 w-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Main Login Card - Glassmorphism */}
        <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-8 sm:p-10 animate-fade-in-up">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-1 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-center">
              Unloading QC Monitor
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              PT Energi Unggul Persada
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-300 ml-1"
                >
                  Username
                </label>
                <div className="relative group">
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/20 group-hover:bg-black/50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 ml-1"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full px-4 py-3.5 pr-12 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 hover:border-white/20 group-hover:bg-black/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all duration-200"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                <div className="text-red-400 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-emerald-800 disabled:to-teal-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Sistem</span>
              )}
            </button>
          </form>

        </div>
        
        {/* TV Display Shortcuts */}
        <div className="mt-8 w-full flex flex-col items-center animate-fade-in delay-500">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">Akses Cepat TV Display</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tv/cpo" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 rounded-xl backdrop-blur-md transition-all duration-300 group">
              <Monitor className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">TV CPO</span>
            </Link>
            <Link href="/tv/pk" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-xl backdrop-blur-md transition-all duration-300 group">
              <Monitor className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">TV PK</span>
            </Link>
            <Link href="/tv/cangkang" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 rounded-xl backdrop-blur-md transition-all duration-300 group">
              <Monitor className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">TV Cangkang</span>
            </Link>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-8 text-center space-y-2 opacity-70 hover:opacity-100 transition-opacity duration-300">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} KPN CORP. All rights reserved.
          </p>
          <p className="text-slate-500 text-[10px] tracking-wider uppercase">
            Unloading QC Monitor v1.1.0
          </p>
        </div>
      </div>
    </div>
  )
}
