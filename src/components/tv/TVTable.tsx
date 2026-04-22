"use client"

import { useEffect, useState, Suspense } from "react"
import { getPublicDashboardLogs } from "@/app/(qc)/dashboard/actions"
import { useSearchParams } from "next/navigation"

type Column = {
  key: string
  label: string
  align?: "left" | "right" | "center"
  dataType?: "string" | "number" | "time" | "decimal"
}

type Props = {
  materialType: string
  title: string
  columns: Column[]
  pageSize?: number
}

const STATUS_COLORS: Record<string, string> = {
  BONGKAR: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  CANCEL: "bg-red-500/20 text-red-300 border border-red-500/30",
  COMPLETED: "bg-green-500/20 text-green-300 border border-green-500/30",
}

const STATUS_COLORS_LIGHT: Record<string, string> = {
  BONGKAR: "bg-blue-100 text-blue-800 border border-blue-200",
  PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  CANCEL: "bg-red-100 text-red-800 border border-red-200",
  COMPLETED: "bg-green-100 text-green-800 border border-green-200",
}

// Inner component that uses useSearchParams — must be wrapped in <Suspense>
function TVTableInner({ materialType, title, columns, pageSize = 15 }: Props) {
  const [logs, setLogs] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const isDark = (searchParams.get("theme") ?? "dark") !== "light"

  const statusColors = isDark ? STATUS_COLORS : STATUS_COLORS_LIGHT

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return "-"
    switch (type) {
      case "time":
        return new Date(value).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      case "decimal":
        return typeof value === "number" ? value.toFixed(2) : value
      default:
        return value.toString()
    }
  }

  const fetchLogs = async () => {
    try {
      const data = await getPublicDashboardLogs(materialType, false, 100)
      setLogs(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    const dataInterval = setInterval(fetchLogs, 10000)
    return () => clearInterval(dataInterval)
  }, [materialType])

  useEffect(() => {
    const totalPages = Math.ceil(logs.length / pageSize)
    if (totalPages <= 1) return
    const pageInterval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages)
    }, 15000)
    return () => clearInterval(pageInterval)
  }, [logs.length, pageSize])

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize))
  const visibleLogs = logs.slice(page * pageSize, (page + 1) * pageSize)

  const borderColor = isDark ? "border-gray-800" : "border-gray-200"
  const headerBg = isDark ? "bg-gray-800/50 text-gray-400" : "bg-gray-100 text-gray-500"
  const rowHover = isDark ? "hover:bg-gray-800/40" : "hover:bg-gray-50"
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"

  return (
    <div className={`rounded-lg border overflow-hidden ${cardBg}`}>
      <div className={`px-5 py-3 flex justify-between items-center border-b ${borderColor} ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <h2 className="font-bold text-base tracking-wide">{title}</h2>
        <div className="flex items-center gap-3 text-xs">
          {totalPages > 1 && (
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>
              Halaman {page + 1}/{totalPages} — auto ganti setiap 15s
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            {logs.length} kendaraan aktif
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className={`p-10 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Memuat data...
          </div>
        ) : logs.length === 0 ? (
          <div className={`p-10 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Tidak ada kendaraan aktif saat ini.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className={`text-xs uppercase ${headerBg}`}>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-2.5 font-medium text-${col.align ?? "left"}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${borderColor}`}>
              {visibleLogs.map((log) => (
                <tr key={log.id} className={`${rowHover} transition-colors`}>
                  {columns.map((col) => {
                    const value = log[col.key]
                    if (col.key === "status") {
                      return (
                        <td key={col.key} className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[value] ?? ""}`}>
                            {value}
                          </span>
                        </td>
                      )
                    }
                    const formatted = formatValue(value, col.dataType)
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-2.5 text-${col.align ?? "left"} ${col.key === "noPolisi" ? "font-semibold uppercase" : ""}`}
                      >
                        {formatted}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={`px-5 py-2 flex justify-center gap-1.5 border-t ${borderColor}`}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === page
                  ? isDark ? "bg-blue-400 w-4" : "bg-blue-600 w-4"
                  : isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Exported wrapper — provides the required <Suspense> boundary for useSearchParams
export default function TVTable(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-10 text-center text-gray-500">
          Memuat tampilan...
        </div>
      }
    >
      <TVTableInner {...props} />
    </Suspense>
  )
}
