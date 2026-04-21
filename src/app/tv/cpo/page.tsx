import TVTable from "@/components/tv/TVTable"

const CPO_COLUMNS = [
  { key: "noPolisi", label: "No Polisi" },
  { key: "pmks", label: "PMKS" },
  { key: "status", label: "Status" },
  { key: "ffa", label: "FFA (%)", align: "right" as const, dataType: "decimal" as const },
  { key: "moisture", label: "Moisture (%)", align: "right" as const, dataType: "decimal" as const },
]

export default function TVCPOPage() {
  return (
    <TVTable
      materialType="CPO"
      title="CPO — Status Bongkar Aktif"
      columns={CPO_COLUMNS}
    />
  )
}
