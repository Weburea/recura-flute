import { AlertCircle, LucideIcon } from "lucide-react"

export interface AlertItem {
  id: string
  name: string
  value: string | number
  valueLabel?: string
  helperText?: string
  icon?: LucideIcon
}

export interface InventoryAlertsProps {
  title?: string
  alerts?: AlertItem[]
}

const defaultAlerts: AlertItem[] = [
  {
    id: "SKU-001",
    name: "Premium Plan License",
    value: 5,
    valueLabel: "left",
    helperText: "Min: 10"
  },
  {
    id: "SKU-045",
    name: "Enterprise Package",
    value: 3,
    valueLabel: "left",
    helperText: "Min: 8"
  },
  {
    id: "SKU-023",
    name: "Starter Kit Bundle",
    value: 7,
    valueLabel: "left",
    helperText: "Min: 15"
  }
]

export function InventoryAlerts({
  title = "Low Inventory Alerts",
  alerts = defaultAlerts
}: InventoryAlertsProps) {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="dashboard-title">{title}</h3>
        <button className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline cursor-pointer">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon || AlertCircle
          return (
            <div 
              key={alert.id} 
              className="flex items-center justify-between p-5 rounded-2xl bg-[#F3E8FF]/30 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 transition-all hover:bg-[#F3E8FF]/50 dark:hover:bg-purple-500/20 cursor-pointer group"
            >
              <div className="flex items-center gap-5">
                <div className="dashboard-icon-box bg-white dark:bg-transparent border border-purple-100 dark:border-white/10 text-purple-600 dark:text-purple-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">{alert.name}</p>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{alert.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold text-purple-600 dark:text-purple-400">
                  {alert.value} {alert.valueLabel || ""}
                </p>
                {alert.helperText && (
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{alert.helperText}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
