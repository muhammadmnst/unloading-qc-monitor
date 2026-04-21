"use server"

import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcryptjs from "bcryptjs"

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

export async function changePassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!newPassword || newPassword !== confirmPassword) {
    throw new Error("Passwords do not match or are empty")
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  })

  return { success: true }
}
