import { LayoutNavigationOverview } from "@/modules/documentation/sections/layout/LayoutNavigationOverview"
import { PageLayoutSystem } from "@/modules/documentation/sections/layout/PageLayoutSystem"
import { SidebarNavigationDoc } from "@/modules/documentation/sections/layout/SidebarNavigationDoc"
import { SubNavigationDoc } from "@/modules/documentation/sections/layout/SubNavigationDoc"
import { GlobalBarsDoc } from "@/modules/documentation/sections/layout/GlobalBarsDoc"
import { PageHeaderDoc } from "@/modules/documentation/sections/layout/PageHeaderDoc"
import { ResponsiveNavigationDoc } from "@/modules/documentation/sections/layout/ResponsiveNavigationDoc"
import { RoutingStructureDoc } from "@/modules/documentation/sections/layout/RoutingStructureDoc"
import { EmailTemplatesDoc } from "@/modules/documentation/sections/layout/EmailTemplatesDoc"
import { DocContent } from "@/modules/documentation/components/DocContent"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function LayoutDocPage({ params }: PageProps) {
  const { slug } = await params

  const sections: Record<string, { title: string, description: string, component: React.ComponentType }> = {
    "overview": {
      title: "Layout & Navigation Overview",
      description: "Understand the high-level architecture of Recura's dashboard and navigation systems.",
      component: LayoutNavigationOverview
    },
    "page-layout": {
      title: "Page Layout System",
      description: "Explore the different layout models available for dashboard, settings, and auth pages.",
      component: PageLayoutSystem
    },
    "sidebar": {
      title: "Sidebar Navigation",
      description: "Deep dive into the main sidebar component, branding, and item behaviors.",
      component: SidebarNavigationDoc
    },
    "sub-navigation": {
      title: "Sub Navigation",
      description: "Learn how to implement nested navigation for complex modules like Settings.",
      component: SubNavigationDoc
    },
    "global-bars": {
      title: "Navigation & Global Bars",
      description: "Comprehensive guide to Topbar, Navbar, and Footer ecosystems across the platform.",
      component: GlobalBarsDoc
    },
    "page-header": {
      title: "Page Headers",
      description: "Standardized title, description, and action button patterns for page headers.",
      component: PageHeaderDoc
    },
    "responsive": {
      title: "Responsive Behavior",
      description: "How the navigation adapts to mobile, tablet, and desktop viewports.",
      component: ResponsiveNavigationDoc
    },
    "routing": {
      title: "Routing Structure",
      description: "A guide to Recura's URL organization and Next.js App Router conventions.",
      component: RoutingStructureDoc
    },
    "emails": {
      title: "Email System",
      description: "A live preview and coding guide for Recura's email layout system.",
      component: EmailTemplatesDoc
    }
  }

  const section = sections[slug]

  if (!section) {
    notFound()
  }

  return (
    <DocContent title={section.title} description={section.description}>
      <section.component />
    </DocContent>
  )
}
