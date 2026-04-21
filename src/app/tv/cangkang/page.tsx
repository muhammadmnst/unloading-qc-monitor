import TVTable from "@/components/tv/TVTable"

const CANGKANG_COLUMNS = [
  { key: "noPolisi", label: "No Polisi" },
  { key: "pmks", label: "PMKS" },
  { key: "status", label: "Status" },
  { key: "ka", label: "KA (%)", align: "right" as const, dataType: "decimal" as const },
  { key: "kk", label: "KK (%)", align: "right" as const, dataType: "decimal" as const },
  { key: "stone", label: "Stone (%)", align: "right" as const, dataType: "decimal" as const },
]

export default function TVCangkangPage() {
  return (
    <TVTable
      materialType="CANGKANG"
      title="Cangkang — Status Bongkar Aktif"
      columns={CANGKANG_COLUMNS}
    />
  )
}
