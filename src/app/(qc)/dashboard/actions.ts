"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { MaterialType, VehicleStatus } from "@prisma/client"

// Internal shared helper — no auth check, only reads data
async function _fetchDashboardLogs(
  materialType: string, 
  showCompleted: boolean, 
  completedLimit: number = 20,
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    pmks?: string;
    search?: string;
  }
) {
  const activeStatuses = [VehicleStatus.PENDING, VehicleStatus.BONGKAR, VehicleStatus.CANCEL]
  
  const where: any = {}
  if (materialType !== "ALL") {
    where.materialType = materialType as MaterialType
  }

  if (filters?.status) {
    where.status = filters.status as VehicleStatus
  } else if (!showCompleted) {
    where.status = { in: activeStatuses }
  }

  if (filters?.pmks) {
    where.pmks = { contains: filters.pmks, mode: 'insensitive' }
  }

  if (filters?.search) {
    where.OR = [
      { noPolisi: { contains: filters.search, mode: 'insensitive' } },
      { pmks: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters?.startDate || filters?.endDate) {
    where.pendingAt = {}
    if (filters.startDate) where.pendingAt.gte = new Date(filters.startDate)
    if (filters.endDate) {
      const d = new Date(filters.endDate)
      d.setHours(23, 59, 59, 999)
      where.pendingAt.lte = d
    }
  }

  const logs = await prisma.vehicleLog.findMany({
    where,
    orderBy: { pendingAt: 'desc' },
    take: filters?.status === 'COMPLETED' || showCompleted ? completedLimit : undefined
  })

  const sortedLogs = logs.sort((a, b) => {
    const priority = {
      [VehicleStatus.BONGKAR]: 1,
      [VehicleStatus.CANCEL]: 2,
      [VehicleStatus.PENDING]: 3,
      [VehicleStatus.COMPLETED]: 4
    }
    if (priority[a.status] !== priority[b.status]) {
      return priority[a.status] - priority[b.status]
    }
    return b.pendingAt.getTime() - a.pendingAt.getTime()
  })

  return sortedLogs.map(log => {
    let qualitySummary = "-"
    if (log.materialType === "CPO") {
      qualitySummary = `${log.ffa ?? "-"}% / ${log.moisture ?? "-"}%`
    } else {
      qualitySummary = `${log.ka ?? "-"}% / ${log.kk ?? "-"}% / ${log.stone ?? "-"}%`
    }
    
    return {
      ...log,
      pendingAt: log.pendingAt.toISOString(),
      bongkarAt: log.bongkarAt?.toISOString() || null,
      cancelAt: log.cancelAt?.toISOString() || null,
      completedAt: log.completedAt?.toISOString() || null,
      qualitySummary
    }
  })
}

// Authenticated — used by operational dashboards
export async function getDashboardLogs(
  materialType: string, 
  showCompleted: boolean, 
  completedLimit: number = 20,
  filters?: any
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return _fetchDashboardLogs(materialType, showCompleted, completedLimit, filters)
}

// Public — used by TV displays (read-only, no auth required)
export async function getPublicDashboardLogs(materialType: string, showCompleted: boolean = false, completedLimit: number = 50) {
  return _fetchDashboardLogs(materialType, showCompleted, completedLimit)
}

export async function updateVehicleStatus(id: string, newStatus: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const currentLog = await prisma.vehicleLog.findUnique({ where: { id } })
  if (!currentLog) throw new Error("Log not found")

  const updateData: any = { status: newStatus as VehicleStatus }
  const now = new Date()

  // Track timestamps according to the state transition rule (R10)
  if (newStatus === VehicleStatus.BONGKAR && !currentLog.bongkarAt) {
    updateData.bongkarAt = now
  } else if (newStatus === VehicleStatus.CANCEL && !currentLog.cancelAt) {
    updateData.cancelAt = now
  } else if (newStatus === VehicleStatus.COMPLETED && !currentLog.completedAt) {
    updateData.completedAt = now
  }

  await prisma.vehicleLog.update({
    where: { id },
    data: updateData
  })

  return { success: true }
}

export async function deleteVehicleLog(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  if (session.user.role !== 'ADMIN' && session.user.role !== 'QC') {
    throw new Error("Only ADMIN or QC can delete logs")
  }

  await prisma.vehicleLog.delete({
    where: { id }
  })

  return { success: true }
}

export async function getExecutiveSummaryData() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const todayStr = new Date().toISOString().split("T")[0]
  const start = new Date(todayStr)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(todayStr)
  end.setHours(23, 59, 59, 999)

  const logs = await prisma.vehicleLog.findMany({
    where: {
      OR: [
        { pendingAt: { gte: start, lte: end } },
        { completedAt: { gte: start, lte: end } },
        { status: { in: ['PENDING', 'BONGKAR'] } }
      ]
    }
  })

  const thirtyDaysAgo = new Date(start)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const cpoMonthlyLogs = await prisma.vehicleLog.findMany({
    where: {
      materialType: 'CPO',
      pendingAt: {
        gte: thirtyDaysAgo,
        lte: end,
      },
      ffa: { not: null },
      moisture: { not: null }
    },
    select: {
      pendingAt: true,
      ffa: true,
      moisture: true
    }
  })

  let totalCompleted = 0
  let totalPendingHistory = 0
  let activePending = 0
  let totalResolutionTime = 0
  let resolutionCount = 0
  let totalUnloadTime = 0
  let unloadCount = 0
  let slaBreaches = 0
  let totalCancel = 0
  let totalVehiclesToday = 0

  const nowMs = Date.now()
  const SLA_LIMIT_MS = 5 * 60 * 60 * 1000 // 5 hours

  // 1. Core KPIs & SLA
  const isBongkarLangsung = (l: any) => l.bongkarAt && (l.bongkarAt.getTime() - l.pendingAt.getTime() < 10000)

  // Support variables for ideas
  const pmksOutspecCount: Record<string, number> = {}
  const dailyCPO: Record<string, { ffaSum: number; moiscSum: number; count: number }> = {}
  const activeLoad = { CPO: 0, PK: 0, CANGKANG: 0 }
  
  let cpoCount = 0
  let pkCount = 0
  let cangkangCount = 0

  logs.forEach(l => {
    const arrivedToday = l.pendingAt >= start && l.pendingAt <= end
    const completedToday = l.completedAt && l.completedAt >= start && l.completedAt <= end
    
    // Arrival totals based on pendingAt today
    if (arrivedToday) {
      totalVehiclesToday++
      if (l.status === 'CANCEL') totalCancel++
      
      if (l.materialType === 'CPO') cpoCount++
      if (l.materialType === 'PK') pkCount++
      if (l.materialType === 'CANGKANG') cangkangCount++
      
      // Outspec Logic (Only tied to arrived today to get a clean rate)
      if (!isBongkarLangsung(l)) {
        totalPendingHistory++
        // Track PMKS for Worst PMKS Leaderboard
        if (l.pmks) {
          pmksOutspecCount[l.pmks] = (pmksOutspecCount[l.pmks] || 0) + 1
        }
      }
    }

    // Completion totals based on completedAt today
    if (l.status === 'COMPLETED' && completedToday) {
      totalCompleted++
      
      if (l.bongkarAt) {
        totalUnloadTime += (l.completedAt.getTime() - l.bongkarAt.getTime())
        unloadCount++
        
        if (!isBongkarLangsung(l)) {
          totalResolutionTime += (l.bongkarAt.getTime() - l.pendingAt.getTime())
          resolutionCount++
        }
      }
    }

    // Active metrics regardless of arrival day
    if (l.status === 'PENDING') activePending++
    
    if (l.status === 'BONGKAR' && l.bongkarAt && (nowMs - l.bongkarAt.getTime() > SLA_LIMIT_MS)) {
      slaBreaches++
    }

    if (l.status === 'PENDING' || l.status === 'BONGKAR') {
      if (l.materialType === 'CPO') activeLoad.CPO++
      if (l.materialType === 'PK') activeLoad.PK++
      if (l.materialType === 'CANGKANG') activeLoad.CANGKANG++
    }
  })

  // Monthly Quality Trend for CPO
  cpoMonthlyLogs.forEach(l => {
    const moistureNum = parseFloat(l.moisture ?? "")
    if (l.ffa !== null && !isNaN(moistureNum)) {
      const dateStr = l.pendingAt.toISOString().split("T")[0] // YYYY-MM-DD
      if (!dailyCPO[dateStr]) dailyCPO[dateStr] = { ffaSum: 0, moiscSum: 0, count: 0 }
      dailyCPO[dateStr].ffaSum += l.ffa
      dailyCPO[dateStr].moiscSum += moistureNum
      dailyCPO[dateStr].count++
    }
  })

  // Material distribution for Pie Chart (already counted in forEach)
  
  const outspecRate = totalVehiclesToday > 0 ? (totalPendingHistory / totalVehiclesToday) * 100 : 0
  const rejectionRate = totalVehiclesToday > 0 ? (totalCancel / totalVehiclesToday) * 100 : 0
  const avgResolution = resolutionCount > 0 
    ? Number((totalResolutionTime / resolutionCount / 3600000).toFixed(1))
    : 0
  const avgUnload = unloadCount > 0 
    ? Number((totalUnloadTime / unloadCount / 3600000).toFixed(1))
    : 0

  // 2. Format CPO Monthly Trend
  const monthlyQualityCPO = Object.keys(dailyCPO).sort().map(date => {
    const parts = date.split('-')
    const { ffaSum, moiscSum, count } = dailyCPO[date]
    return {
      time: `${parts[2]}/${parts[1]}`, // DD/MM format
      ffa: count > 0 ? Number((ffaSum / count).toFixed(2)) : null,
      moisture: count > 0 ? Number((moiscSum / count).toFixed(2)) : null
    }
  }).filter(d => d.ffa !== null && d.moisture !== null)

  // 3. Format Worst PMKS Leaderboard
  const worstPmksList = Object.entries(pmksOutspecCount)
    .map(([pmks, count]) => ({ pmks, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return {
    totalVehicles: totalVehiclesToday,
    totalCompleted,
    activePending,
    slaBreaches,
    rejectionRate: rejectionRate.toFixed(1),
    outspecRate: outspecRate.toFixed(1),
    avgResolution,
    avgUnload,
    materialDist: [
      { name: "CPO", value: cpoCount },
      { name: "PK", value: pkCount },
      { name: "Cangkang", value: cangkangCount },
    ],
    monthlyQualityCPO,
    worstPmksList,
    activeLoad,
    activeCount: activeLoad.CPO + activeLoad.PK + activeLoad.CANGKANG
  }
}
