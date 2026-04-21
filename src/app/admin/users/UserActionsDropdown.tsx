"use client"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, Key, UserCog, Trash2, ChevronRight } from "lucide-react"
import { deleteUser, resetUserPassword, updateUserRole } from "./actions"

interface UserActionsDropdownProps {
  userId: string
  username: string
  currentRole: string
  isSelf?: boolean
}

export default function UserActionsDropdown({ userId, username, currentRole, isSelf }: UserActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowRoleMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResetPassword = async () => {
    setIsOpen(false)
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

  const handleRoleChange = async (newRole: string) => {
    setIsOpen(false)
    setShowRoleMenu(false)
    if (newRole === currentRole) return

    if (!confirm(`Ubah role "${username}" dari ${currentRole} menjadi ${newRole}?`)) return

    try {
      await updateUserRole(userId, newRole)
      alert(`Role ${username} berhasil diubah menjadi ${newRole}`)
    } catch (err: any) {
      alert("Gagal mengubah role: " + err.message)
    }
  }

  const handleDelete = async () => {
    setIsOpen(false)
    if (isSelf || username === "admin") {
      alert("Tidak dapat menghapus akun admin utama atau diri sendiri.")
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus user "${username}"?`)) return

    try {
      await deleteUser(userId)
    } catch (err: any) {
      alert("Gagal menghapus user: " + err.message)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-muted transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover text-popover-foreground shadow-lg z-50 py-1 origin-top-right animate-in fade-in zoom-in duration-75">
          <button
            onClick={handleResetPassword}
            className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors gap-2"
          >
            <Key className="w-4 h-4 opacity-70" />
            Ganti Password
          </button>
          
          <div className="relative">
            <button
              onMouseEnter={() => setShowRoleMenu(true)}
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors gap-2"
            >
              <div className="flex items-center gap-2">
                <UserCog className="w-4 h-4 opacity-70" />
                Ganti Role
              </div>
              <ChevronRight className={`w-3 h-3 transition-transform ${showRoleMenu ? 'rotate-90' : ''}`} />
            </button>
            
            {showRoleMenu && (
              <div className="absolute right-full top-0 mr-1 w-32 rounded-md border bg-popover text-popover-foreground shadow-lg z-50 py-1 animate-in slide-in-from-right-1 duration-75">
                {['QC', 'OPERATIONAL', 'ADMIN'].map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${currentRole === role ? 'font-bold text-primary' : ''}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-muted my-1" />
          
          <button
            onClick={handleDelete}
            disabled={isSelf || username === "admin"}
            className="w-full flex items-center px-3 py-2 text-sm hover:bg-red-50 text-red-600 dark:hover:bg-red-950 transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 opacity-70" />
            Delete User
          </button>
        </div>
      )}
    </div>
  )
}
