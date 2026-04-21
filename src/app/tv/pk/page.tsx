import TVTable from "@/components/tv/TVTable"

const PK_COLUMNS = [
  { key: "noPolisi", label: "No Polisi" },
  { key: "pmks", label: "PMKS" },
  { key: "status", label: "Status" },
  { key: "ka", label: "KA (%)", align: "right" as const, dataType: "decimal" as const },
  { key: "kk", label: "KK (%)", align: "right" as const, dataType: "decimal" as const },
  { key: "stone", label: "Stone (%)", align: "right" as const, dataType: "decimal" as const },
]

export default function TVPKPage() {
  return (
    <TVTable
      materialType="PK"
      title="PK — Status Bongkar Aktif"
      columns={PK_COLUMNS}
    />
  )
}
