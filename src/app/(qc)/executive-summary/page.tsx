"use client"

import { useEffect, useState } from "react"
import { getExecutiveSummaryData } from "@/app/(qc)/dashboard/actions"
import MonitoringBoard from "@/components/MonitoringBoard"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
  LineChart, Line, Tooltip as LineTooltip
} from "recharts"
import { AlertTriangle, TrendingDown } from "lucide-react"

const MATERIAL_COLORS = {
  CPO: "#eab308", // Yellow
  PK: "#3b82f6", // Blue
  Cangkang: "#8b5cf6" // Purple
}

export default function DashboardExecutiveSummary() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const result = await getExecutiveSummaryData()
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      if (loading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading Executive Summary...</div>
  }

  const {
    totalVehicles,
    totalCompleted,
    activePending,
    slaBreaches,
    rejectionRate,
    outspecRate,
    avgResolution,
    avgUnload,
    materialDist,
    monthlyQualityCPO,
    worstPmksList,
    activeLoad,
    activeCount
  } = data || {}

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8 animate-in fade-in duration-500">
      <div className="mb-6 border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Summary</h1>
          <p className="text-muted-foreground mt-1">Pantau performa bongkar, tren kualitas, dan live alert operasional.</p>
        </div>
        <div className="hidden md:flex gap-4 text-xs font-semibold uppercase">
          {/* Active Field Load indicator */}
          <div className="text-right">
            <span className="text-muted-foreground">Aktif Di Lapangan: </span>
            <span className="text-foreground">{activeCount} Unit</span>
          </div>
        </div>
      </div>

      {/* 1. KEY METRICS (KPIs) - Now 6 Grids */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* SLA Breach Alert */}
        <div className={`p-4 border rounded-xl flex flex-col justify-center shadow-sm transition-colors ${slaBreaches > 0 ? "bg-red-600 outline outline-4 outline-red-600/30 text-white animate-pulse" : "bg-card"}`}>
           <h3 className={`text-[10px] font-bold uppercase ${slaBreaches > 0 ? "text-red-100" : "text-muted-foreground"}`}>SLA Breach {">"} 5 Jam</h3>
           <div className="flex items-center gap-2 mt-1">
             <p className={`text-3xl font-black ${slaBreaches > 0 ? "text-white" : "text-primary"}`}>{slaBreaches}</p>
             {slaBreaches > 0 && <AlertTriangle className="h-6 w-6 text-white" />}
           </div>
           <p className={`text-[10px] mt-1 ${slaBreaches > 0 ? "text-red-200" : "text-muted-foreground"}`}>Truk bongkar terlalu lama</p>
        </div>

        <div className={`p-4 border rounded-xl flex flex-col justify-center shadow-sm ${activePending > 0 ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200" : "bg-card"}`}>
           <h3 className={`text-[10px] font-bold uppercase ${activePending > 0 ? "text-orange-600" : "text-muted-foreground"}`}>Active Outspec (Hold)</h3>
           <p className={`text-3xl font-black mt-1 ${activePending > 0 ? "text-orange-600" : "text-primary"}`}>{activePending}</p>
           <p className={`text-[10px] mt-1 ${activePending > 0 ? "text-orange-600 font-bold" : "text-muted-foreground"}`}>Menunggu konfirmasi</p>
        </div>



        <div className="p-4 border rounded-xl shadow-sm bg-card flex flex-col justify-center">
           <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Total Truk Selesai</h3>
           <p className="text-3xl font-black mt-1 text-primary">{totalCompleted}</p>
           <p className="text-[10px] mt-1 text-muted-foreground">Telah selesai dibongkar</p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm bg-card flex flex-col justify-center">
           <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Rerata Konfirmasi</h3>
           <p className="text-3xl font-black mt-1 text-orange-500">{avgResolution} <span className="text-sm font-medium">jam</span></p>
           <p className="text-[10px] mt-1 text-muted-foreground">Cepat tanggap manajemen</p>
        </div>

        <div className="p-4 border rounded-xl shadow-sm bg-card flex flex-col justify-center">
           <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Rerata Bongkar</h3>
           <p className="text-3xl font-black mt-1 text-emerald-500">{avgUnload} <span className="text-sm font-medium">jam</span></p>
           <p className="text-[10px] mt-1 text-muted-foreground">Lama fisik pembongkaran</p>
        </div>
      </div>

      {/* 2. DYNAMIC GRID LAYOUT FOR CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* === ROW 1 === */}
        {/* Pie Chart (1/3 Width) */}
        <div className="lg:col-span-4 p-5 flex flex-col border rounded-xl bg-card shadow-sm h-80 transition-all hover:shadow-md">
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 tracking-wider">Komposisi Distribusi Material</h3>

          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                >
                  {materialDist.map((entry: any, index: number) => {
                    const FALLBACK_COLORS = ["#eab308", "#3b82f6", "#8b5cf6"];
                    const color = (MATERIAL_COLORS as any)[entry.name] || FALLBACK_COLORS[index % 3];
                    return <Cell key={`cell-${index}`} fill={color} stroke="transparent" />
                  })}
                </Pie>
                <PieTooltip wrapperClassName="text-xs rounded-md shadow-lg" />
                <Legend iconType="circle" wrapperStyle={{fontSize: "12px", paddingTop: "20px"}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart (2/3 Width) */}
        <div className="lg:col-span-8 p-5 flex flex-col border rounded-xl bg-card shadow-sm h-80 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">CPO Quality Trend (30 Hari)</h3>
              <p className="text-[10px] text-muted-foreground">Fluktuasi FFA dan Moisture rata-rata harian dalam 30 hari terakhir.</p>
            </div>
            <span className="text-[10px] uppercase font-bold bg-muted px-2 py-1 rounded text-muted-foreground border">Historical</span>
          </div>
          <div className="flex-1 w-full h-full min-h-0 mt-4">
            {monthlyQualityCPO && monthlyQualityCPO.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyQualityCPO} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" tick={{fontSize: 10}} tickMargin={10} />
                  <YAxis yAxisId="left" tick={{fontSize: 10}} orientation="left" />
                  <YAxis yAxisId="right" tick={{fontSize: 10}} orientation="right" />
                  <LineTooltip
                    wrapperClassName="text-xs rounded-md shadow-lg"
                    cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                    formatter={(value: any) => [
                      (value == null || isNaN(value)) ? "-" : `${value}%`,
                      undefined
                    ]}
                  />
                  <Legend iconType="circle" wrapperStyle={{fontSize: "12px", paddingTop: "5px"}} />
                  <Line yAxisId="left" type="monotone" dataKey="ffa" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="FFA (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Moisture (%)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/20">
                Belum ada rekaman kualitas CPO bulan ini
              </div>
            )}
          </div>
        </div>

        {/* === ROW 2 === */}
        {/* PMKS & Load (1/3 Width) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-5 border rounded-xl bg-card shadow-sm flex-1 flex flex-col justify-center transition-all hover:shadow-md">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1.5 tracking-wider">
              <TrendingDown className="w-4 h-4 text-destructive" /> Top 3 PMKS Outspec
            </h3>

            {worstPmksList && worstPmksList.length > 0 ? (
              <div className="space-y-3">
                {worstPmksList.map((item: any, i: number) => (
                  <div key={item.pmks} className="flex justify-between items-center bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-muted-foreground w-4">{i + 1}.</span>
                      <span className="text-sm font-bold uppercase">{item.pmks}</span>
                    </div>
                    <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{item.count} Kasus</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center text-xs text-muted-foreground bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 border-dashed">
                ✨ Kondisi aman. Nol kasus Outspec.
              </div>
            )}
          </div>

          <div className="p-5 border rounded-xl bg-card shadow-sm flex-1 flex flex-col justify-center transition-all hover:shadow-md">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-1 tracking-wider">Current Load Activity</h3>

            
            {activeCount > 0 ? (
              <div className="w-full h-8 rounded-full overflow-hidden flex shadow-inner text-[10px] font-bold text-white text-center">
                {activeLoad.CPO > 0 && <div style={{width: `${(activeLoad.CPO/activeCount)*100}%`}} className="bg-yellow-500 flex items-center justify-center transition-all">{activeLoad.CPO}</div>}
                {activeLoad.PK > 0 && <div style={{width: `${(activeLoad.PK/activeCount)*100}%`}} className="bg-blue-500 flex items-center justify-center transition-all">{activeLoad.PK}</div>}
                {activeLoad.CANGKANG > 0 && <div style={{width: `${(activeLoad.CANGKANG/activeCount)*100}%`}} className="bg-purple-500 flex items-center justify-center transition-all">{activeLoad.CANGKANG}</div>}
              </div>
            ) : (
              <div className="w-full h-8 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-inner">KOSONG (0 Truk)</div>
            )}
            
            <div className="flex gap-4 mt-4 text-[10px] font-bold justify-center text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>CPO ({activeLoad.CPO})</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>PK ({activeLoad.PK})</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></div>Cangkang ({activeLoad.CANGKANG})</div>
            </div>
          </div>
        </div>

        {/* Bar Chart (2/3 Width) */}
        <div className="lg:col-span-8 p-5 flex flex-col border rounded-xl bg-card shadow-sm h-full transition-all hover:shadow-md min-h-[340px]">
          <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 tracking-wider">Durasi Waktu: Resolusi Manajemen vs Fisik Bongkar</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Membandingkan bottleneck waktu yang habis terbuang akibat menunggu keputusan (Pending Outspec).</p>
          <div className="flex-1 w-full h-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Time Metrics (Min)", Resolusi: avgResolution, Bongkar: avgUnload }
                ]}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                barSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" unit="m" tick={{fontSize: 11}} tickMargin={8} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 11}} width={120} />
                <BarTooltip wrapperClassName="text-xs rounded-md shadow-lg" cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: "12px", paddingTop: "10px"}} />
                <Bar dataKey="Resolusi" stackId="a" fill="#f97316" name="Waktu Tahan Resolusi Outspec" radius={[4, 0, 0, 4]} />
                <Bar dataKey="Bongkar" stackId="a" fill="#10b981" name="Waktu Fisik Pembongkaran" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  )
}
