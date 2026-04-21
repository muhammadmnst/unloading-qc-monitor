"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { MaterialType, VehicleStatus } from "@prisma/client"

// ─────────────────────────────────────────────
// EXISTING TYPES & ACTIONS
// ─────────────────────────────────────────────

export type ReportSummary = {
  materialType: MaterialType
  totalVehicles: number
  avgWaitTime: number // minutes
  avgUnloadTime: number // minutes
  avgTotalTime: number // minutes
}

export async function getReportData(startDate: string, endDate: string): Promise<ReportSummary[]> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      status: VehicleStatus.COMPLETED,
      pendingAt: { gte: start, lte: end },
      bongkarAt: { not: null },
      completedAt: { not: null },
    },
  })

  const types: MaterialType[] = [MaterialType.CPO, MaterialType.PK, MaterialType.CANGKANG]

  return types.map((type) => {
    const materialLogs = logs.filter((l) => l.materialType === type)
    const count = materialLogs.length

    if (count === 0) {
      return { materialType: type, totalVehicles: 0, avgWaitTime: 0, avgUnloadTime: 0, avgTotalTime: 0 }
    }

    const totalWait = materialLogs.reduce((acc, log) => acc + (log.bongkarAt!.getTime() - log.pendingAt.getTime()), 0)
    const totalUnload = materialLogs.reduce((acc, log) => acc + (log.completedAt!.getTime() - log.bongkarAt!.getTime()), 0)
    const totalCycle = materialLogs.reduce((acc, log) => acc + (log.completedAt!.getTime() - log.pendingAt.getTime()), 0)

    return {
      materialType: type,
      totalVehicles: count,
      avgWaitTime: Math.round(totalWait / count / 60000),
      avgUnloadTime: Math.round(totalUnload / count / 60000),
      avgTotalTime: Math.round(totalCycle / count / 60000),
    }
  })
}

export async function getDetailedReportData(startDate: string, endDate: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      status: VehicleStatus.COMPLETED,
      pendingAt: { gte: start, lte: end },
    },
    orderBy: { pendingAt: "desc" },
  })

  return logs.map((log) => {
    const waitTime = log.bongkarAt ? Math.round((log.bongkarAt.getTime() - log.pendingAt.getTime()) / 60000) : 0
    const unloadTime = log.completedAt && log.bongkarAt ? Math.round((log.completedAt.getTime() - log.bongkarAt.getTime()) / 60000) : 0
    const totalTime = log.completedAt ? Math.round((log.completedAt.getTime() - log.pendingAt.getTime()) / 60000) : 0

    return {
      ...log,
      pendingAt: log.pendingAt.toISOString(),
      bongkarAt: log.bongkarAt?.toISOString() || null,
      completedAt: log.completedAt?.toISOString() || null,
      waitTime,
      unloadTime,
      totalTime,
    }
  })
}

// ─────────────────────────────────────────────
// LAPORAN 1: KUALITAS PER SUPPLIER (PMKS)
// ─────────────────────────────────────────────

export type SupplierQualityRow = {
  pmks: string
  materialType: MaterialType
  totalVehicles: number
  avgFfa: number | null
  avgMoisture: number | null
  avgKa: number | null
  avgKk: number | null
  avgStone: number | null
}

export async function getSupplierQualityReport(startDate: string, endDate: string): Promise<SupplierQualityRow[]> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      status: VehicleStatus.COMPLETED,
      pendingAt: { gte: start, lte: end },
    },
    orderBy: [{ pmks: "asc" }, { materialType: "asc" }],
  })

  // Group by pmks + materialType
  const groups = new Map<string, typeof logs>()
  for (const log of logs) {
    const key = `${log.pmks}||${log.materialType}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(log)
  }

  const avg = (nums: (number | null | undefined)[]): number | null => {
    const valid = nums.filter((n): n is number => n != null && !isNaN(n))
    return valid.length > 0 ? Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 100) / 100 : null
  }

  const result: SupplierQualityRow[] = []
  for (const [key, groupLogs] of groups.entries()) {
    const [pmks, materialType] = key.split("||") as [string, MaterialType]
    result.push({
      pmks,
      materialType,
      totalVehicles: groupLogs.length,
      avgFfa: avg(groupLogs.map((l) => l.ffa)),
      avgMoisture: avg(groupLogs.map((l) => parseFloat(l.moisture ?? ""))),
      avgKa: avg(groupLogs.map((l) => l.ka)),
      avgKk: avg(groupLogs.map((l) => l.kk)),
      avgStone: avg(groupLogs.map((l) => l.stone)),
    })
  }

  return result
}

// ─────────────────────────────────────────────
// LAPORAN 2: PEMBATALAN / PENOLAKAN (CANCELLATIONS)
// ─────────────────────────────────────────────

export async function getCancellationReport(startDate: string, endDate: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      status: VehicleStatus.CANCEL,
      pendingAt: { gte: start, lte: end },
    },
    include: {
      recordedBy: { select: { username: true } },
    },
    orderBy: { cancelAt: "desc" },
  })

  return logs.map((log) => ({
    id: log.id,
    noPolisi: log.noPolisi,
    pmks: log.pmks,
    materialType: log.materialType,
    remarks: log.remarks,
    pendingAt: log.pendingAt.toISOString(),
    cancelAt: log.cancelAt?.toISOString() || null,
    recordedBy: log.recordedBy.username,
  }))
}

// ─────────────────────────────────────────────
// LAPORAN 3: PRODUKTIVITAS PETUGAS QC (OPERATOR PERFORMANCE)
// ─────────────────────────────────────────────

export type OperatorPerformanceRow = {
  username: string
  completed: number
  cancelled: number
  total: number
}

export async function getOperatorPerformanceReport(startDate: string, endDate: string): Promise<OperatorPerformanceRow[]> {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      pendingAt: { gte: start, lte: end },
      status: { in: [VehicleStatus.COMPLETED, VehicleStatus.CANCEL] },
    },
    include: {
      recordedBy: { select: { username: true } },
    },
  })

  // Group by user
  const groupMap = new Map<string, { completed: number; cancelled: number }>()
  for (const log of logs) {
    const uname = log.recordedBy.username
    if (!groupMap.has(uname)) groupMap.set(uname, { completed: 0, cancelled: 0 })
    const entry = groupMap.get(uname)!
    if (log.status === VehicleStatus.COMPLETED) entry.completed++
    else if (log.status === VehicleStatus.CANCEL) entry.cancelled++
  }

  return Array.from(groupMap.entries())
    .map(([username, counts]) => ({
      username,
      completed: counts.completed,
      cancelled: counts.cancelled,
      total: counts.completed + counts.cancelled,
    }))
    .sort((a, b) => b.completed - a.completed)
}

// ─────────────────────────────────────────────
// LAPORAN 4: ANOMALI KUALITAS (OUT-OF-SPEC)
// Standar:
//   CPO      -> ffa > 5%,  moisture > 0.5%
//   PK       -> ka > 8%,   kk > 8%,  stone > 1%
//   CANGKANG -> ka > 20%,  kk > 5%,  stone > 1%
// ─────────────────────────────────────────────

export type OutlierFlag = {
  param: string
  value: number
  limit: number
}

export async function getOutlierReport(startDate: string, endDate: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      status: VehicleStatus.COMPLETED,
      pendingAt: { gte: start, lte: end },
    },
    orderBy: { pendingAt: "desc" },
  })

  const isOutlier = (log: (typeof logs)[0]): OutlierFlag[] => {
    const flags: OutlierFlag[] = []

    if (log.materialType === MaterialType.CPO) {
      if (log.ffa != null && log.ffa > 5) flags.push({ param: "FFA", value: log.ffa, limit: 5 })
      const moisture = parseFloat(log.moisture ?? "")
      if (!isNaN(moisture) && moisture > 0.5) flags.push({ param: "Moisture", value: moisture, limit: 0.5 })
    }

    if (log.materialType === MaterialType.PK) {
      if (log.ka != null && log.ka > 8) flags.push({ param: "KA", value: log.ka, limit: 8 })
      if (log.kk != null && log.kk > 8) flags.push({ param: "KK", value: log.kk, limit: 8 })
      if (log.stone != null && log.stone > 1) flags.push({ param: "Stone", value: log.stone, limit: 1 })
    }

    if (log.materialType === MaterialType.CANGKANG) {
      if (log.ka != null && log.ka > 20) flags.push({ param: "KA", value: log.ka, limit: 20 })
      if (log.kk != null && log.kk > 5) flags.push({ param: "KK", value: log.kk, limit: 5 })
      if (log.stone != null && log.stone > 1) flags.push({ param: "Stone", value: log.stone, limit: 1 })
    }

    return flags
  }

  const result = []
  for (const log of logs) {
    const flags = isOutlier(log)
    if (flags.length > 0) {
      result.push({
        id: log.id,
        noPolisi: log.noPolisi,
        pmks: log.pmks,
        materialType: log.materialType,
        pendingAt: log.pendingAt.toISOString(),
        ffa: log.ffa,
        moisture: log.moisture,
        ka: log.ka,
        kk: log.kk,
        stone: log.stone,
        flags,
      })
    }
  }

  return result
}
