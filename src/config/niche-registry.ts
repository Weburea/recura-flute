export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'file';
  placeholder?: string;
  required?: boolean;
}

export interface NicheConfig {
  pageTitle: string;
  pageSubtitle: string;
  entityLabel: string;
  col3Header: string;
  col4Header: string;
  tabs: string[];
  ctaLabel: string;
  statusBadgeStyles: Record<string, string>;
  formFields: FormField[];
  
  // Subscription page configuration parameters
  subPageTitle: string;
  subPageSubtitle: string;
  subCtaLabel: string;
  subTableTitle: string;
  subPlanColHeader: string;
  subBillingColHeader: string;
  subEntityLabel: string;
  subTabs: string[];
}

export const NICHE_REGISTRY: Record<string, NicheConfig> = {
  saas: {
    pageTitle: "Subscribers",
    pageSubtitle: "All customers subscribed to your SaaS plans",
    entityLabel: "Subscribers",
    col3Header: "Subscription Plan",
    col4Header: "Total Spent",
    tabs: ["All", "Active", "Inactive"],
    ctaLabel: "Add Subscriber",
    statusBadgeStyles: {
      Active: "status-badge-active",
      Trial: "status-badge-trial",
      Inactive: "status-badge-canceled",
    },
    formFields: [
      { id: "name", label: "Subscriber Name", type: "text", placeholder: "e.g. Sarah Connor", required: true },
      { id: "email", label: "Email Address", type: "email", placeholder: "sarah@cyberdyne.com", required: true },
      { id: "plan", label: "Subscription Plan", type: "text", placeholder: "e.g. Enterprise Package" },
      { id: "spent", label: "Initial Spent ($)", type: "number", placeholder: "0.00" },
      { id: "avatarUrl", label: "Avatar / Logo Image", type: "file" },
    ],
    subPageTitle: "Subscription Tiers",
    subPageSubtitle: "Manage subscription plans and customer subscriptions",
    subCtaLabel: "Create Subscription",
    subTableTitle: "Subscription List",
    subPlanColHeader: "Plan",
    subBillingColHeader: "Billing Cycle",
    subEntityLabel: "subscriptions",
    subTabs: ["All", "Active", "Paused", "Canceled"],
  },
  agencies: {
    pageTitle: "CRM & Leads",
    pageSubtitle: "Manage your client relationships and incoming leads",
    entityLabel: "Clients",
    col3Header: "Retainer",
    col4Header: "LTV",
    tabs: ["All", "Active", "Inactive"],
    ctaLabel: "Add Client",
    statusBadgeStyles: {
      Active: "status-badge-active",
      Trial: "status-badge-trial",
      Inactive: "status-badge-canceled",
    },
    formFields: [
      { id: "name", label: "Client Name", type: "text", placeholder: "e.g. Acme Corporation", required: true },
      { id: "email", label: "Client Email", type: "email", placeholder: "contact@acme.com", required: true },
      { id: "plan", label: "Retainer Type", type: "text", placeholder: "e.g. Full-Suite Retainer" },
      { id: "spent", label: "Lifetime Value ($)", type: "number", placeholder: "0.00" },
      { id: "avatarUrl", label: "Client Logo", type: "file" },
    ],
    subPageTitle: "Retainer Contracts",
    subPageSubtitle: "Manage client retainer agreements and contract lifecycle",
    subCtaLabel: "New Contract",
    subTableTitle: "Contract List",
    subPlanColHeader: "Contract Type",
    subBillingColHeader: "Monthly Retainer",
    subEntityLabel: "contracts",
    subTabs: ["All", "Active", "Paused", "Canceled"],
  },
  social_media: {
    pageTitle: "CRM & Leads",
    pageSubtitle: "Track social media clients and campaign leads",
    entityLabel: "Clients",
    col3Header: "Campaign Type",
    col4Header: "Revenue",
    tabs: ["All", "Active", "Inactive"],
    ctaLabel: "Add Campaign Client",
    statusBadgeStyles: {
      Active: "status-badge-active",
      Trial: "status-badge-trial",
      Inactive: "status-badge-canceled",
    },
    formFields: [
      { id: "name", label: "Brand / Client Name", type: "text", placeholder: "e.g. Brand Inc", required: true },
      { id: "email", label: "Email Address", type: "email", placeholder: "social@brand.com", required: true },
      { id: "plan", label: "Campaign / Service", type: "text", placeholder: "e.g. Instagram Growth Package" },
      { id: "spent", label: "Campaign Revenue ($)", type: "number", placeholder: "0.00" },
      { id: "avatarUrl", label: "Client Brand Avatar", type: "file" },
    ],
    subPageTitle: "Content Packages",
    subPageSubtitle: "Manage social media client retainers and deliverable agreements",
    subCtaLabel: "New Package",
    subTableTitle: "Package List",
    subPlanColHeader: "Package Type",
    subBillingColHeader: "Monthly Retainer",
    subEntityLabel: "packages",
    subTabs: ["All", "Active", "Paused", "Canceled"],
  },
  startups: {
    pageTitle: "Pilot Customers",
    pageSubtitle: "Manage your early adopters and pilot program participants",
    entityLabel: "Pilots",
    col3Header: "Pilot Plan",
    col4Header: "Contract Value",
    tabs: ["All", "Active", "Inactive"],
    ctaLabel: "Add Pilot Customer",
    statusBadgeStyles: {
      Active: "status-badge-active",
      Trial: "status-badge-trial",
      Inactive: "status-badge-canceled",
    },
    formFields: [
      { id: "name", label: "Pilot Partner Name", type: "text", placeholder: "e.g. TechLabs", required: true },
      { id: "email", label: "Partner Email", type: "email", placeholder: "pilot@techlabs.io", required: true },
      { id: "plan", label: "Pilot Tier / Plan", type: "text", placeholder: "e.g. Beta Pilot Tier" },
      { id: "spent", label: "Contract Value ($)", type: "number", placeholder: "0.00" },
      { id: "avatarUrl", label: "Partner Logo", type: "file" },
    ],
    subPageTitle: "Pricing Tiers",
    subPageSubtitle: "Define your product's pricing tiers and pilot agreements",
    subCtaLabel: "Create Tier",
    subTableTitle: "Pricing Tiers List",
    subPlanColHeader: "Tier",
    subBillingColHeader: "Billing Cycle",
    subEntityLabel: "tiers",
    subTabs: ["All", "Active", "Paused", "Canceled"],
  },
  marketplaces: {
    pageTitle: "Buyers & Vendors",
    pageSubtitle: "Track buyers, vendors, and marketplace participants",
    entityLabel: "Participants",
    col3Header: "Category",
    col4Header: "Total Spend",
    tabs: ["All", "Active", "Inactive"],
    ctaLabel: "Add Participant",
    statusBadgeStyles: {
      Active: "status-badge-active",
      Trial: "status-badge-trial",
      Inactive: "status-badge-canceled",
    },
    formFields: [
      { id: "name", label: "Participant Name", type: "text", placeholder: "e.g. Alex Mercer", required: true },
      { id: "email", label: "Email Address", type: "email", placeholder: "alex@mercer.com", required: true },
      { id: "plan", label: "Marketplace Category", type: "text", placeholder: "e.g. Vendor / Buyer" },
      { id: "spent", label: "Total Marketplace Spend ($)", type: "number", placeholder: "0.00" },
      { id: "avatarUrl", label: "Participant Avatar", type: "file" },
    ],
    subPageTitle: "Product Catalog",
    subPageSubtitle: "Manage your marketplace product listings and pricing",
    subCtaLabel: "Add Product",
    subTableTitle: "Product List",
    subPlanColHeader: "Product / SKU",
    subBillingColHeader: "Price",
    subEntityLabel: "products",
    subTabs: ["All", "Active", "Paused", "Canceled"],
  },
  other: {
    pageTitle: "Customers",
    pageSubtitle: "Manage all customers on your platform",
    entityLabel: "Customers",
    col3Header: "Plan",
    col4Header: "Total Spent",
    tabs: ["All", "Active", "Inactive"],
    ctaLabel: "Add Customer",
    statusBadgeStyles: {
      Active: "status-badge-active",
      Trial: "status-badge-trial",
      Inactive: "status-badge-canceled",
    },
    formFields: [
      { id: "name", label: "Customer Name", type: "text", placeholder: "e.g. Jane Smith", required: true },
      { id: "email", label: "Customer Email", type: "email", placeholder: "jane@smith.org", required: true },
      { id: "plan", label: "Associated Plan", type: "text", placeholder: "e.g. Standard Plan" },
      { id: "spent", label: "Total Spent ($)", type: "number", placeholder: "0.00" },
      { id: "avatarUrl", label: "Profile Image", type: "file" },
    ],
    subPageTitle: "Subscriptions",
    subPageSubtitle: "Manage plans and customer subscriptions",
    subCtaLabel: "Create Subscription",
    subTableTitle: "Subscription List",
    subPlanColHeader: "Plan",
    subBillingColHeader: "Billing Cycle",
    subEntityLabel: "subscriptions",
    subTabs: ["All", "Active", "Paused", "Canceled"],
  },
};

export function getNormalizedNiche(businessType: string | null): keyof typeof NICHE_REGISTRY {
  const bt = businessType ? businessType.toLowerCase().trim() : "";
  if (bt === "saas") return "saas";
  if (bt === "agencies" || bt === "agency") return "agencies";
  if (bt === "social_media" || bt === "social") return "social_media";
  if (bt === "startups" || bt === "startup") return "startups";
  if (bt === "marketplaces" || bt === "marketplace" || bt === "ecommerce" || bt === "e-commerce") return "marketplaces";
  return "other";
}
