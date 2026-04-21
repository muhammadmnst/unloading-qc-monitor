"use client"

import MonitoringBoard from "@/components/MonitoringBoard"

const CANGKANG_COLUMNS = [
  { key: "ka", label: "KA (%)", align: "right" as const },
  { key: "kk", label: "KK (%)", align: "right" as const },
  { key: "stone", label: "Stone (%)", align: "right" as const },
  { key: "pendingAt", label: "Submit QC", align: "left" as const },
]

export default function DashboardCangkang() {
  return (
    <MonitoringBoard
      materialType="CANGKANG"
      title="Cangkang Monitoring Board"
      columns={CANGKANG_COLUMNS}
    />
  )
}
