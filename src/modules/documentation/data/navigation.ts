import { 
  BookOpen, 
  Palette, 
  Layout, 
  Square, 
  MousePointer2, 
  CreditCard, 
  Table, 
  Layers, 
  BarChart3,
  Rocket,
  Compass,
  Code2,
  BellRing,
  SquareStack,
  FileText,
  Mail
} from "lucide-react"

export const documentationNav = [
  {
    title: "Overview",
    items: [
      { label: "Overview", href: "/dashboard/documentation", icon: BookOpen },
      { label: "Getting Started", href: "/dashboard/documentation/getting-started", icon: Rocket },
      { label: "Installation Guide", href: "/dashboard/documentation/getting-started/installation", icon: Rocket },
      { label: "Design System", href: "/dashboard/documentation/design-system", icon: Palette },
    ]
  },
  {
    title: "Components",
    collapsible: true,
    items: [
      { label: "Buttons", href: "/dashboard/documentation/components/buttons", icon: Square },
      { label: "Forms", href: "/dashboard/documentation/components/forms", icon: MousePointer2 },
      { label: "Cards", href: "/dashboard/documentation/components/cards", icon: Layout },
      { label: "Tables", href: "/dashboard/documentation/components/tables", icon: Table },
      { label: "Alerts & Receipts", href: "/dashboard/documentation/components/alerts-receipts", icon: BellRing },
      { label: "Modals", href: "/dashboard/documentation/components/modals", icon: SquareStack },
      { label: "Icons", href: "/dashboard/documentation/components/icons", icon: Palette },
    ]
  },
  {
    title: "Layout & Navigation",
    collapsible: true,
    items: [
      { label: "Overview", href: "/dashboard/documentation/layout/overview", icon: BookOpen },
      { label: "Page Layout", href: "/dashboard/documentation/layout/page-layout", icon: Layout },
      { label: "Sidebar", href: "/dashboard/documentation/layout/sidebar", icon: MousePointer2 },
      { label: "Sub Navigation", href: "/dashboard/documentation/layout/sub-navigation", icon: Layers },
      { label: "Global Bars", href: "/dashboard/documentation/layout/global-bars", icon: Square },
      { label: "Page Headers", href: "/dashboard/documentation/layout/page-header", icon: FileText },
      { label: "Responsive Behavior", href: "/dashboard/documentation/layout/responsive", icon: Layout },
      { label: "Routing Structure", href: "/dashboard/documentation/layout/routing", icon: Compass },
      { label: "Emails", href: "/dashboard/documentation/layout/emails", icon: Mail },
    ]
  },
  {
    title: "Advanced",
    items: [
      { label: "Payments UI", href: "/dashboard/documentation/payments", icon: CreditCard },
      { label: "Charts & Analytics", href: "/dashboard/documentation/components/charts-analytics", icon: BarChart3 },
      { label: "Developer Guide", href: "/dashboard/documentation/guide", icon: Code2 },
    ]
  }
]
