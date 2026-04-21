"use server"

import { prisma } from "@/lib/prisma"
import bcryptjs from "bcryptjs"
import { revalidatePath } from "next/cache"
import { UserRole } from "@prisma/client"

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as UserRole

  if (!username || !password || !role) {
    throw new Error("Missing required fields")
  }

  const hashedPassword = await bcryptjs.hash(password, 12)

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  })

  revalidatePath("/admin/users")
}

export async function deleteUser(userId: string) {
  if (!userId) {
    throw new Error("Missing user ID")
  }

  await prisma.user.delete({
    where: { id: userId },
  })

  revalidatePath("/admin/users")
}

export async function resetUserPassword(userId: string, formData: FormData) {
  const password = formData.get("password") as string
  if (!password) throw new Error("Password cannot be empty")

  const hashedPassword = await bcryptjs.hash(password, 12)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function updateUserRole(userId: string, role: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: role as UserRole }
  })
  revalidatePath("/admin/users")
  return { success: true }
}
