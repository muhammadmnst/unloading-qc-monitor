"use client"

import MonitoringBoard from "@/components/MonitoringBoard"

const CPO_COLUMNS = [
  { key: "ffa", label: "FFA (%)", align: "right" as const },
  { key: "moisture", label: "Moisture (%)", align: "right" as const },
  { key: "pendingAt", label: "Submit QC", align: "left" as const },
]

export default function DashboardCPO() {
  return (
    <MonitoringBoard
      materialType="CPO"
      title="CPO Monitoring Board"
      columns={CPO_COLUMNS}
    />
  )
}
