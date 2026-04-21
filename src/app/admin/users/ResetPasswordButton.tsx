"use client"

import { resetUserPassword } from "./actions"

export default function ResetPasswordButton({ userId, username }: { userId: string, username: string }) {
  const handleReset = async () => {
    const newPassword = window.prompt(`Masukkan password baru untuk user "${username}":`)
    
    if (!newPassword) return

    if (newPassword.length < 4) {
      alert("Password terlalu pendek (minimal 4 karakter)")
      return
    }

    try {
      const formData = new FormData()
      formData.append("password", newPassword)
      await resetUserPassword(userId, formData)
      alert(`Password untuk ${username} berhasil diubah!`)
    } catch (err: any) {
      alert("Gagal meriset password: " + err.message)
    }
  }

  return (
    <button
      onClick={handleReset}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-muted h-8 px-3"
    >
      Ganti Password
    </button>
  )
}
