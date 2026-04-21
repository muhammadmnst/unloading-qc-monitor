"use client"

import { useState, useEffect } from "react"
import {
  getReportData, ReportSummary,
  getDetailedReportData,
  getSupplierQualityReport, SupplierQualityRow,
  getCancellationReport,
  getOperatorPerformanceReport, OperatorPerformanceRow,
  getOutlierReport,
} from "./actions"

type ViewType = "summary" | "detail" | "supplier" | "cancellations" | "operator" | "anomalies"

const TABS: { id: ViewType; label: string }[] = [
  { id: "summary",       label: "Ringkasan" },
  { id: "detail",        label: "Detail Kendaraan" },
  { id: "supplier",      label: "Kualitas Supplier" },
  { id: "cancellations", label: "Pembatalan" },
  { id: "operator",      label: "Produktivitas QC" },
  { id: "anomalies",     label: "Anomali Kualitas" },
]

const MATERIAL_BADGE: Record<string, string> = {
  CPO:      "bg-amber-500/15 text-amber-400 border-amber-500/30",
  PK:       "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CANGKANG: "bg-sky-500/15 text-sky-400 border-sky-500/30",
}

export default function ReportsPage() {
  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate]     = useState(today)
  const [endDate, setEndDate]         = useState(today)
  const [view, setView]               = useState<ViewType>("summary")
  const [searchTerm, setSearchTerm]   = useState("")
  const [loading, setLoading]         = useState(true)

  // Data states
  const [summaryData,     setSummaryData]     = useState<ReportSummary[]>([])
  const [detailData,      setDetailData]      = useState<any[]>([])
  const [supplierData,    setSupplierData]    = useState<SupplierQualityRow[]>([])
  const [cancelData,      setCancelData]      = useState<any[]>([])
  const [operatorData,    setOperatorData]    = useState<OperatorPerformanceRow[]>([])
  const [anomalyData,     setAnomalyData]     = useState<any[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      switch (view) {
        case "summary":       setSummaryData(await getReportData(startDate, endDate)); break
        case "detail":        setDetailData(await getDetailedReportData(startDate, endDate)); break
        case "supplier":      setSupplierData(await getSupplierQualityReport(startDate, endDate)); break
        case "cancellations": setCancelData(await getCancellationReport(startDate, endDate)); break
        case "operator":      setOperatorData(await getOperatorPerformanceReport(startDate, endDate)); break
        case "anomalies":     setAnomalyData(await getOutlierReport(startDate, endDate)); break
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [startDate, endDate, view])

  const fmt = (iso: string | null) => {
    if (!iso) return "-"
    return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
  }

  const fmtNum = (n: number | null | undefined, suffix = "%") =>
    n != null ? `${n}${suffix}` : "-"

  const filteredDetail    = detailData.filter(l =>
    l.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.pmks.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredCancels   = cancelData.filter(l =>
    l.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.pmks.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredAnomalies = anomalyData.filter(l =>
    l.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.pmks.toLowerCase().includes(searchTerm.toLowerCase()))

  const showSearch = ["detail", "cancellations", "anomalies"].includes(view)

  // ── CSV Export ──────────────────────────────────────────────────
  const downloadCSV = () => {
    let headers: string[] = []
    let rows: string[][] = []

    if (view === "summary") {
      headers = ["Tipe Material","Total Kendaraan","Waktu Pending (Min)","Waktu Bongkar (Min)","Total Waktu (Min)"]
      rows = summaryData.map(d => [d.materialType, String(d.totalVehicles), String(d.avgWaitTime), String(d.avgUnloadTime), String(d.avgTotalTime)])
    } else if (view === "detail") {
      headers = ["No Polisi","PMKS","Material","Masuk","Selesai","Pending (m)","Bongkar (m)","Total (m)","FFA","Moisture","KA","KK","Stone"]
      rows = detailData.map(d => [d.noPolisi, d.pmks, d.materialType, fmt(d.pendingAt), fmt(d.completedAt), String(d.waitTime), String(d.unloadTime), String(d.totalTime), d.ffa ?? "-", d.moisture ?? "-", d.ka ?? "-", d.kk ?? "-", d.stone ?? "-"])
    } else if (view === "supplier") {
      headers = ["PMKS","Material","Total Kendaraan","Avg FFA","Avg Moisture","Avg KA","Avg KK","Avg Stone"]
      rows = supplierData.map(d => [d.pmks, d.materialType, String(d.totalVehicles), fmtNum(d.avgFfa), fmtNum(d.avgMoisture), fmtNum(d.avgKa), fmtNum(d.avgKk), fmtNum(d.avgStone)])
    } else if (view === "cancellations") {
      headers = ["No Polisi","PMKS","Material","Masuk","Dibatalkan","Petugas","Alasan"]
      rows = cancelData.map(d => [d.noPolisi, d.pmks, d.materialType, fmt(d.pendingAt), fmt(d.cancelAt), d.recordedBy, d.remarks ?? "-"])
    } else if (view === "operator") {
      headers = ["Petugas","Selesai","Dibatalkan","Total Diproses"]
      rows = operatorData.map(d => [d.username, String(d.completed), String(d.cancelled), String(d.total)])
    } else if (view === "anomalies") {
      headers = ["No Polisi","PMKS","Material","Masuk","Parameter Melebihi Batas"]
      rows = anomalyData.map(d => [d.noPolisi, d.pmks, d.materialType, fmt(d.pendingAt), d.flags.map((f: any) => `${f.param}=${f.value}>${f.limit}`).join("; ")])
    }

    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `report-${view}-${startDate}-to-${endDate}.csv`
    link.click()
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operational Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Analisis performa, kualitas, dan efisiensi operasional unloading.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3 bg-muted/30 p-4 rounded-xl border shadow-sm w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-background border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button onClick={downloadCSV}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-end justify-between border-b gap-4 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setView(tab.id); setSearchTerm("") }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                view === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        {showSearch && (
          <div className="relative pb-2">
            <input type="text" placeholder="Cari No Polisi / PMKS..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-xs bg-background border rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-primary" />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="border rounded-xl shadow-sm overflow-hidden bg-card text-card-foreground">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-muted-foreground">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              Memuat data laporan...
            </div>
          ) : (

            // ── 1. RINGKASAN ─────────────────────────────────────
            view === "summary" ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Tipe Material</th>
                    <th className="px-6 py-4 text-center">Total Kendaraan</th>
                    <th className="px-6 py-4 text-right">Waktu Pending (Min)</th>
                    <th className="px-6 py-4 text-right">Waktu Bongkar (Min)</th>
                    <th className="px-6 py-4 text-right">Rerata Total Cycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {summaryData.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Tidak ada data untuk periode ini.</td></tr>
                  )}
                  {summaryData.map(row => (
                    <tr key={row.materialType} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-md border text-xs font-bold ${MATERIAL_BADGE[row.materialType]}`}>{row.materialType}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">{row.totalVehicles}</td>
                      <td className="px-6 py-4 text-right tabular-nums">{row.avgWaitTime} m</td>
                      <td className="px-6 py-4 text-right tabular-nums">{row.avgUnloadTime} m</td>
                      <td className="px-6 py-4 text-right tabular-nums font-bold">{row.avgTotalTime} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            // ── 2. DETAIL KENDARAAN ──────────────────────────────
            ) : view === "detail" ? (
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">No Polisi</th>
                    <th className="px-4 py-3">PMKS</th>
                    <th className="px-4 py-3">Material</th>
                    <th className="px-4 py-3">Masuk</th>
                    <th className="px-4 py-3">Selesai</th>
                    <th className="px-4 py-3 text-right">Pending</th>
                    <th className="px-4 py-3 text-right">Bongkar</th>
                    <th className="px-4 py-3 text-right font-bold">Total</th>
                    <th className="px-4 py-3 text-right">Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDetail.length === 0 && (
                    <tr><td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">Tidak ada data.</td></tr>
                  )}
                  {filteredDetail.map(log => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-bold uppercase">{log.noPolisi}</td>
                      <td className="px-4 py-3 uppercase">{log.pmks}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-bold ${MATERIAL_BADGE[log.materialType]}`}>{log.materialType}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{fmt(log.pendingAt)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmt(log.completedAt)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{log.waitTime}m</td>
                      <td className="px-4 py-3 text-right tabular-nums">{log.unloadTime}m</td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold">{log.totalTime}m</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {log.materialType === "CPO"
                          ? `FFA ${fmtNum(log.ffa)} / M ${log.moisture ?? "-"}%`
                          : `KA ${fmtNum(log.ka)} / KK ${fmtNum(log.kk)} / St ${fmtNum(log.stone)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            // ── 3. KUALITAS SUPPLIER ─────────────────────────────
            ) : view === "supplier" ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-5 py-3">PMKS</th>
                    <th className="px-5 py-3">Material</th>
                    <th className="px-5 py-3 text-center">Kendaraan</th>
                    <th className="px-5 py-3 text-right">Avg FFA</th>
                    <th className="px-5 py-3 text-right">Avg Moisture</th>
                    <th className="px-5 py-3 text-right">Avg KA</th>
                    <th className="px-5 py-3 text-right">Avg KK</th>
                    <th className="px-5 py-3 text-right">Avg Stone</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {supplierData.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">Tidak ada data untuk periode ini.</td></tr>
                  )}
                  {supplierData.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-semibold uppercase">{row.pmks}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-1.5 py-0.5 rounded border text-xs font-bold ${MATERIAL_BADGE[row.materialType]}`}>{row.materialType}</span>
                      </td>
                      <td className="px-5 py-3 text-center tabular-nums">{row.totalVehicles}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtNum(row.avgFfa)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtNum(row.avgMoisture)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtNum(row.avgKa)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtNum(row.avgKk)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtNum(row.avgStone)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            // ── 4. PEMBATALAN ────────────────────────────────────
            ) : view === "cancellations" ? (
              <>
                <div className="px-6 py-3 bg-muted/30 border-b flex items-center gap-3">
                  <span className="text-sm font-semibold">Total Pembatalan:</span>
                  <span className="text-lg font-bold text-destructive">{cancelData.length}</span>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-5 py-3">No Polisi</th>
                      <th className="px-5 py-3">PMKS</th>
                      <th className="px-5 py-3">Material</th>
                      <th className="px-5 py-3">Waktu Masuk</th>
                      <th className="px-5 py-3">Waktu Batal</th>
                      <th className="px-5 py-3">Petugas</th>
                      <th className="px-5 py-3">Alasan / Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCancels.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Tidak ada pembatalan untuk periode ini.</td></tr>
                    )}
                    {filteredCancels.map(log => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 font-bold uppercase">{log.noPolisi}</td>
                        <td className="px-5 py-3 uppercase">{log.pmks}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded border text-xs font-bold ${MATERIAL_BADGE[log.materialType]}`}>{log.materialType}</span>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{fmt(log.pendingAt)}</td>
                        <td className="px-5 py-3 text-muted-foreground">{fmt(log.cancelAt)}</td>
                        <td className="px-5 py-3 font-medium">{log.recordedBy}</td>
                        <td className="px-5 py-3 text-muted-foreground italic">{log.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>

            // ── 5. PRODUKTIVITAS OPERATOR ────────────────────────
            ) : view === "operator" ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Nama Petugas</th>
                    <th className="px-6 py-4 text-center">Kendaraan Selesai</th>
                    <th className="px-6 py-4 text-center">Kendaraan Dibatalkan</th>
                    <th className="px-6 py-4 text-center font-bold">Total Diproses</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {operatorData.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Tidak ada data aktivitas untuk periode ini.</td></tr>
                  )}
                  {operatorData.map((row, i) => (
                    <tr key={row.username} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground tabular-nums">{i + 1}</td>
                      <td className="px-6 py-4 font-semibold">{row.username}</td>
                      <td className="px-6 py-4 text-center font-medium text-emerald-600 tabular-nums">{row.completed}</td>
                      <td className="px-6 py-4 text-center tabular-nums text-muted-foreground">{row.cancelled}</td>
                      <td className="px-6 py-4 text-center font-bold tabular-nums">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            // ── 6. ANOMALI KUALITAS ──────────────────────────────
            ) : view === "anomalies" ? (
              <>
                <div className="px-6 py-3 bg-destructive/5 border-b flex flex-wrap items-center gap-4">
                  <span className="text-sm font-semibold text-destructive">⚠ Total Anomali: {anomalyData.length}</span>
                  <span className="text-xs text-muted-foreground">
                    Batas: CPO (FFA&gt;5%, Moisture&gt;0.5%) | PK (KA&gt;8%, KK&gt;8%, Stone&gt;1%) | Cangkang (KA&gt;20%, KK&gt;5%, Stone&gt;1%)
                  </span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">No Polisi</th>
                      <th className="px-4 py-3">PMKS</th>
                      <th className="px-4 py-3">Material</th>
                      <th className="px-4 py-3">Masuk</th>
                      <th className="px-4 py-3">Parameter Melebihi Batas</th>
                      <th className="px-4 py-3 text-right">FFA</th>
                      <th className="px-4 py-3 text-right">M/KA</th>
                      <th className="px-4 py-3 text-right">KK</th>
                      <th className="px-4 py-3 text-right">Stone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAnomalies.length === 0 && (
                      <tr><td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">Tidak ada anomali ditemukan. Semua kendaraan memenuhi standar kualitas. ✓</td></tr>
                    )}
                    {filteredAnomalies.map(log => {
                      const flagParams = new Set(log.flags.map((f: any) => f.param))
                      const flagClass = (param: string) =>
                        flagParams.has(param) ? "text-destructive font-bold" : "text-muted-foreground"
                      return (
                        <tr key={log.id} className="hover:bg-destructive/5 transition-colors">
                          <td className="px-4 py-3 font-bold uppercase">{log.noPolisi}</td>
                          <td className="px-4 py-3 uppercase">{log.pmks}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-bold ${MATERIAL_BADGE[log.materialType]}`}>{log.materialType}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(log.pendingAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {log.flags.map((f: any, fi: number) => (
                                <span key={fi} className="inline-block px-1.5 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded text-[10px] font-semibold">
                                  {f.param} {f.value}% &gt; {f.limit}%
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-right tabular-nums ${flagClass("FFA")}`}>{fmtNum(log.ffa)}</td>
                          <td className={`px-4 py-3 text-right tabular-nums ${flagClass("KA") !== "text-muted-foreground" || flagClass("Moisture") !== "text-muted-foreground" ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                            {log.materialType === "CPO" ? (log.moisture ?? "-") + "%" : fmtNum(log.ka)}
                          </td>
                          <td className={`px-4 py-3 text-right tabular-nums ${flagClass("KK")}`}>{fmtNum(log.kk)}</td>
                          <td className={`px-4 py-3 text-right tabular-nums ${flagClass("Stone")}`}>{fmtNum(log.stone)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </>
            ) : null
          )}
        </div>
      </div>

    </div>
  )
}
