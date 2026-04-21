"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { getDashboardLogs, updateVehicleStatus, deleteVehicleLog } from "@/app/(qc)/dashboard/actions"
import { MoreHorizontal, Search, Filter, Calendar, X, Trash2 } from "lucide-react"

interface MonitoringBoardProps {
  materialType: "ALL" | "CPO" | "PK" | "CANGKANG"
  title: string
  columns: { key: string; label: string; align?: "left" | "right" | "center"; isNumeric?: boolean }[]
}

export default function MonitoringBoard({ materialType, title, columns }: MonitoringBoardProps) {
  const { data: session } = useSession()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [completedLimit, setCompletedLimit] = useState(20)
  
  // Filters
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [pmks, setPmks] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  // Menu Dropdown
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const fetchLogs = async () => {
    try {
      const filters = {
        status: status || undefined,
        pmks: pmks || undefined,
        search: search || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      }
      const data = await getDashboardLogs(materialType, showHistory, completedLimit, filters)
      setLogs(data)
    } catch (e) {
      console.error(e)
    } finally {
      if (loading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 10000)
    return () => clearInterval(interval)
  }, [materialType, showHistory, completedLimit, status, pmks, search, startDate, endDate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateVehicleStatus(id, newStatus)
      await fetchLogs()
    } catch (e) {
      alert("Gagal update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return
    try {
      await deleteVehicleLog(id)
      setOpenMenuId(null)
      await fetchLogs()
    } catch (e) {
      alert("Gagal menghapus data")
    }
  }

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "-"
    const d = new Date(isoString)
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const isAdminOrQC = session?.user?.role === "ADMIN" || session?.user?.role === "QC"

  return (
    <div className="space-y-4">
      {/* Filters & Search Bar */}
      <div className="bg-card border rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1">Cari Kendaraan / PMKS</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="No Polisi atau PMKS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="w-full md:w-40 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="BONGKAR">Bongkar</option>
              <option value="COMPLETED">Selesai</option>
              <option value="CANCEL">Batal</option>
            </select>
          </div>

          <div className="w-full md:w-56 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground ml-1">Rentang Tanggal</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-background border rounded-md focus:outline-none"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-background border rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {(search || status || pmks || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearch("")
                  setStatus("")
                  setPmks("")
                  setStartDate("")
                  setEndDate("")
                }}
                className="p-2 text-muted-foreground hover:text-foreground border rounded-md"
                title="Reset Filter"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${showHistory ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
            >
              {showHistory ? "Sembunyikan Arsip" : "Tampilkan Arsip"}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b flex justify-between items-center">
          <h2 className="font-semibold text-sm">{title}</h2>
          <span className="text-xs text-muted-foreground">{logs.length} Data ditemukan</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-medium">No Polisi</th>
                <th className="px-4 py-3 font-medium">PMKS</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {columns.map(col => (
                  <th key={col.key} className={`px-4 py-3 font-medium ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={columns.length + 4} className="px-4 py-12 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={columns.length + 4} className="px-4 py-12 text-center text-muted-foreground">Tidak ada data yang ditemukan.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-4 py-3 font-semibold uppercase">{log.noPolisi}</td>
                    <td className="px-4 py-3">{log.pmks}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        ${log.status === 'BONGKAR' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                          log.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          log.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {log.status}
                      </span>
                    </td>
                    {columns.map(col => {
                      const value = log[col.key]
                      const isQualityMetric = ['ffa', 'moisture', 'ka', 'kk', 'stone'].includes(col.key)
                      const formattedValue = col.key === 'pendingAt' 
                        ? formatDateTime(value) 
                        : (value !== null && value !== undefined && value !== "" ? (isQualityMetric ? `${value}%` : value) : "-")
                      
                      return (
                        <td key={col.key} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                          {formattedValue}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {log.status === "PENDING" && (
                          <>
                            {session?.user?.role !== "OPERATIONAL" && (
                              <button onClick={() => handleStatusUpdate(log.id, "BONGKAR")} className="px-2 py-1 text-[10px] uppercase font-bold bg-blue-600 text-white rounded hover:bg-blue-700">Bongkar</button>
                            )}
                            {session?.user?.role !== "OPERATIONAL" && (
                              <button onClick={() => handleStatusUpdate(log.id, "CANCEL")} className="px-2 py-1 text-[10px] uppercase font-bold bg-red-50 text-red-600 border border-red-100 rounded hover:bg-red-100">Batal</button>
                            )}
                          </>
                        )}
                        {log.status === "BONGKAR" && session?.user?.role !== "QC" && (
                          <button onClick={() => handleStatusUpdate(log.id, "COMPLETED")} className="px-2 py-1 text-[10px] uppercase font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700">Selesai</button>
                        )}
                        {log.status === "COMPLETED" && (
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">Selesai</span>
                        )}
                        {log.status === "CANCEL" && (
                          <span className="text-[10px] text-red-500 uppercase font-medium">Batal</span>
                        )}

                        {/* Opsi Delete (Admin/QC) */}
                        {isAdminOrQC && (
                          <div className="relative inline-block ml-1">
                            <button 
                              onClick={() => setOpenMenuId(openMenuId === log.id ? null : log.id)}
                              className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            
                            {openMenuId === log.id && (
                              <div 
                                ref={menuRef}
                                className="absolute right-0 bottom-full mb-1 w-24 bg-popover border rounded shadow-lg z-50 overflow-hidden"
                              >
                                <button 
                                  onClick={() => handleDelete(log.id)}
                                  className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showHistory && logs.length >= completedLimit && (
        <div className="pt-2 text-center">
          <button 
            onClick={() => setCompletedLimit(prev => prev + 20)}
            className="text-sm text-primary hover:underline font-medium"
          >
            Tampilkan lebih banyak data arsip...
          </button>
        </div>
      )}
    </div>
  )
}
