"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { MaterialType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function registerVehicle(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const materialType = formData.get("materialType") as MaterialType
  const status = (formData.get("status") as string) || "PENDING"
  const noPolisi = formData.get("noPolisi") as string
  const pmks = formData.get("pmks") as string

  if (!materialType || !noPolisi || !pmks) {
    throw new Error("Missing required fields")
  }

  let ffa = null, moisture = null, ka = null, kk = null, stone = null

  if (materialType === "CPO") {
    ffa = formData.get("ffa") ? parseFloat(formData.get("ffa") as string) : null
    moisture = formData.get("moisture") as string || null
  } else if (materialType === "PK" || materialType === "CANGKANG") {
    ka = formData.get("ka") ? parseFloat(formData.get("ka") as string) : null
    kk = formData.get("kk") ? parseFloat(formData.get("kk") as string) : null
    stone = formData.get("stone") ? parseFloat(formData.get("stone") as string) : null
  }

  await prisma.vehicleLog.create({
    data: {
      materialType,
      noPolisi,
      pmks,
      status: status as any,
      ffa,
      moisture,
      ka,
      kk,
      stone,
      recordedById: session.user.id,
      pendingAt: new Date(),
      bongkarAt: status === "BONGKAR" ? new Date() : null,
    }
  })

  // We could revalidate the dashboard here once constructed.
  revalidatePath("/register")
  // redirect("/success") // Or handle state dynamically on client
  return { success: true }
}
