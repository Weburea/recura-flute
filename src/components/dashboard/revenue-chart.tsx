"use client"

import * as React from "react"
import { ChevronDown, BarChart2, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RevenueChartProps {
  title?: string
  subtitle?: string
  yearData?: Record<string, number[]>
}

// ─── SVG Line / Area Chart ────────────────────────────────────────────────────

function AreaLineChart({ data, months }: { data: number[]; months: string[] }) {
  const W = 600
  const H = 220
  const PAD_X = 4
  const PAD_Y = 36

  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1

  // Map each data point to SVG coordinates
  const pts = data.map((v, i) => {
    const x = PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2)
    const y = PAD_Y + (1 - (v - min) / range) * (H - PAD_Y * 2)
    return { x, y, v }
  })

  // Build smooth cubic bezier path
  const linePath = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x},${p.y}`
      const prev = pts[i - 1]
      const cpX = (prev.x + p.x) / 2
      return `C ${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`
    })
    .join(" ")

  // Close the area path along the bottom grid line
  const areaPath =
    linePath +
    ` L ${pts[pts.length - 1].x},${H - PAD_Y} L ${pts[0].x},${H - PAD_Y} Z`

  return (
    <div className="relative w-full flex-1 min-h-[220px] overflow-x-auto no-scrollbar">
      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        preserveAspectRatio="none"
        className="w-full h-full min-w-[520px]"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal guide lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const gy = PAD_Y + t * (H - PAD_Y * 2)
          return (
            <line
              key={t}
              x1={PAD_X}
              y1={gy}
              x2={W - PAD_X}
              y2={gy}
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeWidth="1"
              className="text-slate-900 dark:text-white"
            />
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke="#9333ea"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points + tooltips */}
        {pts.map((p, i) => (
          <g key={i} className="group/pt">
            {/* Invisible hit area */}
            <circle cx={p.x} cy={p.y} r={14} fill="transparent" />

            {/* Visible dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="white"
              stroke="#9333ea"
              strokeWidth="2.5"
              className="opacity-0 group-hover/pt:opacity-100 transition-opacity duration-150"
            />

            {/* Tooltip */}
            <g className="opacity-0 group-hover/pt:opacity-100 transition-opacity duration-150">
              <rect
                x={p.x - 34}
                y={p.y - 30}
                width={68}
                height={22}
                rx={6}
                fill="#0f172a"
              />
              <text
                x={p.x}
                y={p.y - 14}
                textAnchor="middle"
                fill="white"
                fontSize="9"
                fontWeight="700"
              >
                {p.v > 0 ? `$${(p.v * 1234).toLocaleString()}` : "—"}
              </text>
            </g>

            {/* Month label */}
            <text
              x={p.x}
              y={H + 20}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="currentColor"
              className="text-slate-400"
              opacity="0.7"
            >
              {months[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChartView({ data, months }: { data: number[]; months: string[] }) {
  const maxVal = Math.max(...data, 1)

  return (
    <div className="flex-1 overflow-x-auto no-scrollbar pb-2 group/scroll pt-12">
      <div className="flex items-end justify-between gap-3 md:gap-5 px-2 min-w-[600px] md:min-w-0 h-full">
        {data.map((val, i) => {
          const barHeight = Math.max(18, Math.round((val / maxVal) * 100))
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-6 group h-full justify-end">
              <div className="relative w-full flex flex-col justify-end h-full min-h-[1px]">
                {/* Track */}
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-white/5 rounded-lg w-full" />
                {/* Bar */}
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg transition-all duration-500 ease-out group-hover:from-purple-500 group-hover:to-purple-300 relative cursor-pointer shadow-sm z-10"
                  style={{ height: `${barHeight}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 whitespace-nowrap z-20 pointer-events-none shadow-2xl">
                    {val > 0 ? `$${(val * 1234).toLocaleString()}` : "—"}
                  </div>
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-purple-600 transition-colors whitespace-nowrap">
                {months[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RevenueChart({
  title = "Revenue Overview",
  subtitle = "Monthly revenue",
  yearData = {
    "2026": [40, 55, 70, 85, 80, 60, 90, 85, 65, 95, 85, 75],
    "2025": [30, 45, 60, 75, 70, 50, 80, 75, 55, 90, 80, 65],
    "2024": [45, 60, 50, 65, 80, 75, 60, 70, 85, 75, 60, 55],
    "2023": [20, 35, 50, 45, 60, 55, 40, 50, 65, 55, 40, 35]
  }
}: RevenueChartProps) {
  const [selectedYear, setSelectedYear] = React.useState(() => Object.keys(yearData).sort().reverse()[0] ?? "2026")
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [chartType, setChartType] = React.useState<"bar" | "line">("bar")

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
  const data = yearData[selectedYear] ?? Object.values(yearData)[0] ?? []

  return (
    <div className="dashboard-card lg:col-span-2 flex flex-col min-h-[480px] overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h3 className="dashboard-title">{title}</h3>
          <p className="dashboard-subtitle">{subtitle} for {selectedYear}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Chart type toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-white/5 p-0.5 gap-0.5">
            <button
              id="chart-toggle-bar"
              onClick={() => setChartType("bar")}
              title="Bar chart"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                chartType === "bar"
                  ? "bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-sm"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Bar
            </button>
            <button
              id="chart-toggle-line"
              onClick={() => setChartType("line")}
              title="Line chart"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                chartType === "line"
                  ? "bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-sm"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <LineChart className="w-3.5 h-3.5" />
              Line
            </button>
          </div>

          {/* Year picker */}
          <div className="relative">
            <button
              id="chart-year-picker"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="dashboard-button-secondary"
            >
              {selectedYear}
              <ChevronDown className={cn("w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#150a2e] border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl z-30 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {Object.keys(yearData).sort().reverse().map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setIsDropdownOpen(false)
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-purple-50 dark:hover:bg-purple-500/10",
                      selectedYear === year
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-500/20"
                        : "text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Chart Area ── */}
      {chartType === "bar" ? (
        <BarChartView data={data} months={months} />
      ) : (
        <AreaLineChart data={data} months={months} />
      )}
    </div>
  )
}
