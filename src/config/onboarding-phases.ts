export interface FieldOption {
  label: string;
  value: string;
  helperText?: string;
  disabled?: boolean;
  badge?: string;
  icon?: string;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'url' | 'select' | 'country_select' | 'file' | 'radio_cards' | 'checkbox_group' | 'repeatable' | 'toggle';
  placeholder?: string;
  optional?: boolean;
  options?: FieldOption[];
  helperText?: string; // Static helper text
  helperTextMap?: Record<string, string>; // Dynamic helper text based on selected option value
  helperTextTemplate?: (val: string) => string; // Dynamic helper text based on input value
  helperTextVariant?: 'info' | 'warning';
  autoEstimateFrom?: string;
  itemLabel?: string; // For repeatable lists (e.g. "service" or "product type")
}

export interface PhaseConfig {
  id: string;
  name: string;
  description?: string;
  fields: FieldConfig[];
}

export interface NicheConfig {
  id: string;
  title: string;
  phases: PhaseConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getBranchPhases?: (formData: Record<string, any>) => PhaseConfig[];
}

export const ONBOARDING_CONFIGS: Record<string, NicheConfig> = {
  saas: {
    id: 'saas',
    title: 'SaaS Business',
    phases: [
      {
        id: 'basics',
        name: 'The Basics',
        description: 'Tell us the foundational details of your SaaS platform.',
        fields: [
          { id: 'businessName', label: 'Business name', type: 'text', placeholder: 'Acme SaaS Inc.' },
          { id: 'logo', label: 'Logo upload', type: 'file', optional: true, helperText: 'Upload PNG or SVG (max 2MB)' },
          { id: 'websiteUrl', label: 'Website URL', type: 'url', optional: true, placeholder: 'https://acmesaas.com' },
        ],
      },
      {
        id: 'verify',
        name: 'Verify Your Business',
        description: 'Provide official details for verification & compliance.',
        fields: [
          { id: 'registrationNumber', label: 'Company registration number/CAC', type: 'text', optional: true, placeholder: 'RC-1234567' },
          { id: 'country', label: 'Country of registration', type: 'country_select', placeholder: 'Search or select your country...' },
          { id: 'businessEmail', label: 'Business email', type: 'email', placeholder: 'billing@acmesaas.com' },
        ],
      },
      {
        id: 'billing',
        name: 'How You Bill',
        description: 'Define your core subscription pricing structure.',
        fields: [
          {
            id: 'billingModel',
            label: 'Billing model',
            type: 'select',
            options: [
              { label: 'Flat price', value: 'flat' },
              { label: 'Per-user', value: 'per_user' },
              { label: 'Usage-based', value: 'usage' },
              { label: 'Tiered', value: 'tiered' },
            ],
            helperTextMap: {
              flat: 'Every customer pays the same fixed amount, regardless of usage.',
              per_user: 'You charge based on how many people at each customer\'s company use it.',
              usage: 'Customers pay based on how much they actually use your product.',
              tiered: 'Customers pick from a few fixed pricing tiers with different features.',
            },
          },
          { 
            id: 'avgPricePerCustomer', 
            label: 'Average price per customer ($)', 
            type: 'number', 
            placeholder: '99',
            helperTextTemplate: (val) => `That means your average customer pays $${val} — this helps us set up your revenue dashboard correctly.`,
          },
          {
            id: 'billingFrequency',
            label: 'Billing frequency',
            type: 'select',
            options: [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
              { label: 'Both', value: 'both' },
            ],
            helperTextMap: {
              monthly: 'Monthly: customers are charged every month.',
              yearly: 'Yearly: customers pay once a year, often at a discount.',
              both: 'Both: customers can choose either option.',
            },
          },
        ],
      },
      {
        id: 'scale',
        name: 'Your Scale',
        description: 'Share your customer volume and team size.',
        fields: [
          { id: 'activeCustomers', label: 'Number of active customers', type: 'number', placeholder: '150' },
          { id: 'teamSize', label: 'Number of people on your team', type: 'number', placeholder: '8' },
          { id: 'monthlyInquiries', label: 'Number of customer inquiries monthly', type: 'number', placeholder: '60' },
        ],
      },
      {
        id: 'revenue',
        name: 'Revenue Snapshot',
        description: 'Give us a snapshot of your monthly and annual recurring revenue.',
        fields: [
          { id: 'monthlyRevenue', label: 'Monthly revenue ($)', type: 'number', placeholder: '15000' },
          { id: 'yearlyRevenue', label: 'Yearly revenue ($)', type: 'number', placeholder: '180000', autoEstimateFrom: 'monthlyRevenue' },
        ],
      },
    ],
  },

  agencies: {
    id: 'agencies',
    title: 'Agency & Retainers',
    phases: [
      {
        id: 'basics',
        name: 'The Basics',
        description: 'Tell us about your agency brand and identity.',
        fields: [
          { id: 'agencyName', label: 'Agency name', type: 'text', placeholder: 'Apex Creative Agency' },
          { id: 'logo', label: 'Logo upload', type: 'file', optional: true, helperText: 'Upload PNG or SVG (max 2MB)' },
          { id: 'websiteUrl', label: 'Website URL', type: 'url', optional: true, placeholder: 'https://apexagency.co' },
        ],
      },
      {
        id: 'verify',
        name: 'Verify Your Business',
        description: 'Official registration credentials for contract management.',
        fields: [
          { id: 'registrationNumber', label: 'Company registration number', type: 'text', optional: true, placeholder: 'RC-9876543' },
          { id: 'country', label: 'Country of registration', type: 'country_select', placeholder: 'Search or select your country...' },
          { id: 'businessEmail', label: 'Business email', type: 'email', placeholder: 'contracts@apexagency.co' },
        ],
      },
      {
        id: 'services',
        name: 'Your Services',
        description: 'List the main services your agency offers to clients.',
        fields: [
          {
            id: 'servicesList',
            label: 'Services offered',
            type: 'repeatable',
            placeholder: 'e.g. Web Design',
            itemLabel: 'service',
          },
        ],
      },
      {
        id: 'billing',
        name: 'How You Bill Clients',
        description: 'How do you charge your clients for creative or technical work?',
        fields: [
          {
            id: 'billingStructure',
            label: 'Billing structure',
            type: 'select',
            options: [
              { label: 'Monthly retainer', value: 'retainer' },
              { label: 'Per project', value: 'project' },
              { label: 'Hourly', value: 'hourly' },
            ],
            helperTextMap: {
              retainer: 'Monthly retainer: clients pay you a fixed amount every month regardless of hours worked.',
              project: 'Per project: clients pay a fixed total price per individual project.',
              hourly: 'Hourly: clients are billed based on the exact number of hours worked.',
            },
          },
          { 
            id: 'avgRetainerValue', 
            label: 'Average retainer or project value ($)', 
            type: 'number', 
            placeholder: '3500',
            helperTextTemplate: (val) => `Average retainer/project value: $${val} — used for revenue pipeline estimates.`,
          },
          {
            id: 'contractLength',
            label: 'Typical contract length',
            type: 'select',
            options: [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Ongoing', value: 'ongoing' },
              { label: 'Fixed / One-time', value: 'fixed_onetime' },
            ],
            helperTextMap: {
              monthly: 'Monthly: contract renews every month.',
              quarterly: 'Quarterly: contract renews every 3 months.',
              ongoing: 'Ongoing: no fixed end date.',
              fixed_onetime: 'Fixed / One-time: One deal, one payment — no renewal (e.g. a single property sale, legal case, or one-off project).',
            },
          },
        ],
      },
      {
        id: 'clientBase',
        name: 'Your Client Base',
        description: 'Overview of client workload and team bandwidth.',
        fields: [
          { id: 'activeClients', label: 'Number of active clients', type: 'number', placeholder: '12' },
          { id: 'teamSize', label: 'Number of people on your team', type: 'number', placeholder: '15' },
          { id: 'newClientInquiries', label: 'Number of new client inquiries monthly', type: 'number', placeholder: '25' },
        ],
      },
      {
        id: 'revenue',
        name: 'Revenue Snapshot',
        description: 'Your estimated agency earnings snapshot.',
        fields: [
          { id: 'monthlyRevenue', label: 'Monthly revenue ($)', type: 'number', placeholder: '42000' },
          { id: 'yearlyRevenue', label: 'Yearly revenue ($)', type: 'number', placeholder: '504000', autoEstimateFrom: 'monthlyRevenue' },
        ],
      },
    ],
  },

  social_media: {
    id: 'social_media',
    title: 'Social Media Marketing',
    phases: [
      {
        id: 'basics',
        name: 'The Basics',
        description: 'Define your social media agency or brand details.',
        fields: [
          { id: 'businessName', label: 'Business name', type: 'text', placeholder: 'Apex Social Media Co.' },
          { id: 'logo', label: 'Logo upload', type: 'file', optional: true, helperText: 'Upload PNG or SVG (max 2MB)' },
          { id: 'websiteUrl', label: 'Website URL', type: 'url', optional: true, placeholder: 'https://apexsocial.co' },
        ],
      },
      {
        id: 'verify',
        name: 'Verify Your Business',
        description: 'Provide official details for verification & compliance.',
        fields: [
          { id: 'registrationNumber', label: 'Company registration number', type: 'text', optional: true, placeholder: 'REG-8839201' },
          { id: 'country', label: 'Country of registration', type: 'country_select', placeholder: 'Search or select your country...' },
          { id: 'businessEmail', label: 'Business email', type: 'email', placeholder: 'hello@apexsocial.co' },
        ],
      },
      {
        id: 'services',
        name: 'Your Services',
        description: 'List the social media marketing services you provide.',
        fields: [
          {
            id: 'servicesList',
            label: 'Services offered',
            type: 'repeatable',
            placeholder: 'e.g. Instagram Management, Ad Campaigns, Content Creation',
            itemLabel: 'service',
          },
        ],
      },
      {
        id: 'reach_billing',
        name: 'Your Reach & Billing',
        description: 'Define client volume and campaign billing structure.',
        fields: [
          {
            id: 'billingStructure',
            label: 'How do you bill clients?',
            type: 'select',
            options: [
              { label: 'Monthly retainer', value: 'retainer' },
              { label: 'Per campaign', value: 'campaign' },
              { label: 'Per project', value: 'project' },
            ],
            helperTextMap: {
              retainer: 'Monthly retainer: clients pay you a fixed amount every month.',
              campaign: "Per campaign: you're paid for each specific campaign you run.",
              project: 'Per project: one-off project-based payment.',
            },
          },
          { id: 'activeClients', label: 'Number of active clients', type: 'number', placeholder: '8' },
          { 
            id: 'avgFeePerClient', 
            label: 'Average monthly fee per client ($)', 
            type: 'number', 
            placeholder: '2500',
            helperTextTemplate: (val) => `Average fee per client: $${val} — sets up monthly recurring revenue dashboard.`,
          },
        ],
      },
      {
        id: 'revenue',
        name: 'Revenue Snapshot',
        description: 'Social media agency revenue snapshot.',
        fields: [
          { id: 'monthlyRevenue', label: 'Monthly revenue ($)', type: 'number', placeholder: '20000' },
          { id: 'yearlyRevenue', label: 'Yearly revenue ($)', type: 'number', placeholder: '240000', autoEstimateFrom: 'monthlyRevenue' },
        ],
      },
    ],
  },

  startups: {
    id: 'startups',
    title: 'High-Growth Startup',
    phases: [
      {
        id: 'basics',
        name: 'The Basics',
        description: 'Introduce your startup brand and mission.',
        fields: [
          { id: 'startupName', label: 'Startup name', type: 'text', placeholder: 'Nova AI Technologies' },
          { id: 'logo', label: 'Logo upload', type: 'file', optional: true, helperText: 'Upload PNG or SVG (max 2MB)' },
          { id: 'websiteUrl', label: 'Website URL', type: 'url', optional: true, placeholder: 'https://nova.ai' },
        ],
      },
      {
        id: 'verify',
        name: 'Verify Your Business',
        description: 'Corporate details for banking & investor sync.',
        fields: [
          { id: 'registrationNumber', label: 'Company registration number', type: 'text', optional: true, placeholder: 'ST-001928' },
          { id: 'country', label: 'Country of registration', type: 'country_select', placeholder: 'Search or select your country...' },
          { id: 'businessEmail', label: 'Business email', type: 'email', placeholder: 'founders@nova.ai' },
        ],
      },
      {
        id: 'stage',
        name: 'Your Stage',
        description: 'Growth stage and monetization model.',
        fields: [
          {
            id: 'fundingStage',
            label: 'Funding stage',
            type: 'select',
            options: [
              { label: 'Pre-seed', value: 'pre_seed' },
              { label: 'Seed', value: 'seed' },
              { label: 'Series A+', value: 'series_a_plus' },
              { label: 'Bootstrapped', value: 'bootstrapped' },
            ],
            helperTextMap: {
              pre_seed: 'Pre-seed: very early, before your first major funding round.',
              seed: 'Seed: early traction with initial angel or seed funding.',
              series_a_plus: 'Series A+: scaling rapidly with institutional venture backing.',
              bootstrapped: 'Bootstrapped: self-funded and growing from revenue.',
            },
          },
          {
            id: 'pricingModel',
            label: 'Pricing model',
            type: 'select',
            options: [
              { label: 'Freemium', value: 'freemium' },
              { label: 'Free trial', value: 'free_trial' },
              { label: 'Usage-based', value: 'usage_based' },
            ],
            helperTextMap: {
              freemium: 'Freemium: basic features are free, advanced features cost money.',
              free_trial: 'Free trial: full access for a limited time before payment.',
              usage_based: 'Usage-based: pay dynamically based on consumption volume.',
            },
          },
        ],
      },
      {
        id: 'product',
        name: 'Your Product',
        description: 'Briefly describe your product focus and industry category.',
        fields: [
          { id: 'productDesc', label: 'What does your product do?', type: 'textarea', placeholder: 'e.g. AI-powered workflow automation for engineering teams' },
          { id: 'industry', label: 'Industry category', type: 'text', placeholder: 'e.g. Developer Tools / Artificial Intelligence' },
        ],
      },
      {
        id: 'team',
        name: 'Your Team',
        description: 'Tell us about your team bandwidth.',
        fields: [
          { id: 'teamSize', label: 'Number of people on your team', type: 'number', placeholder: '6' },
          {
            id: 'isHiring',
            label: 'Are you currently hiring?',
            type: 'toggle',
            options: [
              { label: 'Yes, hiring', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
        ],
      },
      {
        id: 'traction',
        name: 'Your Traction',
        description: 'Product adoption metrics and signup velocity.',
        fields: [
          { id: 'trialUsers', label: 'Number of free/trial users', type: 'number', placeholder: '1200' },
          { id: 'payingCustomers', label: 'Number of paying customers (can be 0)', type: 'number', placeholder: '45' },
          { id: 'monthlySignups', label: 'Number of new signups monthly', type: 'number', placeholder: '350' },
        ],
      },
      {
        id: 'funding',
        name: 'Funding So Far',
        description: 'Capital raised and investor network details.',
        fields: [
          { id: 'amountRaised', label: 'Amount raised so far ($)', type: 'number', optional: true, placeholder: '250000' },
          { id: 'investorCount', label: 'Number of investors', type: 'number', optional: true, placeholder: '3' },
        ],
      },
      {
        id: 'revenue',
        name: 'Revenue Snapshot',
        description: 'Current financial velocity.',
        fields: [
          { id: 'monthlyRevenue', label: 'Monthly revenue ($) (can be 0)', type: 'number', placeholder: '4500' },
          { id: 'yearlyRevenue', label: 'Yearly revenue ($) (can be 0)', type: 'number', placeholder: '54000', autoEstimateFrom: 'monthlyRevenue' },
        ],
      },
    ],
  },

  marketplaces: {
    id: 'marketplaces',
    title: 'E-Commerce',
    phases: [
      {
        id: 'basics',
        name: 'The Basics',
        description: 'Platform name and brand assets.',
        fields: [
          { id: 'marketplaceName', label: 'Store or business name', type: 'text', placeholder: 'TradeHub Store' },
          { id: 'logo', label: 'Logo upload', type: 'file', optional: true, helperText: 'Upload PNG or SVG (max 2MB)' },
          { id: 'websiteUrl', label: 'Website URL', type: 'url', optional: true, placeholder: 'https://tradehub.com' },
        ],
      },
      {
        id: 'verify',
        name: 'Verify Your Business',
        description: 'Merchant registration details.',
        fields: [
          { id: 'registrationNumber', label: 'Company registration number', type: 'text', optional: true, placeholder: 'MK-449102' },
          { id: 'country', label: 'Country of registration', type: 'country_select', placeholder: 'Search or select your country...' },
          { id: 'businessEmail', label: 'Business email', type: 'email', placeholder: 'sellers@tradehub.com' },
        ],
      },
      {
        id: 'sell_type',
        name: 'How Do You Sell?',
        description: 'Choose the sales model that best describes your business.',
        fields: [
          {
            id: 'sellModel',
            label: 'Sales model',
            type: 'radio_cards',
            options: [
              { label: 'I sell my own products', value: 'own', helperText: 'I sell my own products: you have one store selling your own inventory.' },
              { label: 'I host multiple sellers on my platform', value: 'marketplace', helperText: 'I host multiple sellers: other businesses sell through your platform and you take a cut.' },
            ],
          },
        ],
      },
      {
        id: 'store_details',
        name: 'Your Store',
        description: 'Configure your product lines and platform integrations.',
        fields: [
          {
            id: 'platforms',
            label: 'Which platforms do you sell on?',
            type: 'checkbox_group',
            options: [
              { label: 'Shopify', value: 'shopify', icon: 'shopify' },
              { label: 'My own website', value: 'custom_site', helperText: 'We\'ll connect this to your existing site via API.', icon: 'website' },
              { label: 'Amazon', value: 'amazon', disabled: true, badge: 'Coming soon', icon: 'amazon' },
              { label: 'Walmart', value: 'walmart', disabled: true, badge: 'Coming soon', icon: 'walmart' },
            ],
          },
          {
            id: 'productTypes',
            label: 'Product types you sell',
            type: 'repeatable',
            placeholder: 'e.g. Bags',
            itemLabel: 'product type',
          },
          { id: 'catalogSize', label: 'Number of products in your catalog', type: 'number', placeholder: '120' },
          { id: 'monthlyOrders', label: 'Number of orders per month', type: 'number', placeholder: '450' },
        ],
      },
      {
        id: 'revenue',
        name: 'Revenue Snapshot',
        description: 'Monthly and annual sales earnings snapshot.',
        fields: [
          { id: 'monthlyRevenue', label: 'How much do you make monthly? ($)', type: 'number', placeholder: '25000' },
          { id: 'yearlyRevenue', label: 'Yearly estimate ($)', type: 'number', placeholder: '300000', autoEstimateFrom: 'monthlyRevenue' },
        ],
      },
    ],

    // Dynamic Branching Handler for Phase 4
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBranchPhases: (formData: Record<string, any>): PhaseConfig[] => {
      const sellModel = formData.sellModel || 'own';

      const basePhases = ONBOARDING_CONFIGS.marketplaces?.phases || [];

      const phase4Store: PhaseConfig = {
        id: 'store_details',
        name: 'Your Store',
        description: 'Configure your product lines and platform integrations.',
        fields: [
          {
            id: 'platforms',
            label: 'Which platforms do you sell on?',
            type: 'checkbox_group',
            options: [
              { label: 'Shopify', value: 'shopify', icon: 'shopify' },
              { label: 'My own website', value: 'custom_site', helperText: 'We\'ll connect this to your existing site via API.', icon: 'website' },
              { label: 'Amazon', value: 'amazon', disabled: true, badge: 'Coming soon', icon: 'amazon' },
              { label: 'Walmart', value: 'walmart', disabled: true, badge: 'Coming soon', icon: 'walmart' },
            ],
          },
          {
            id: 'productTypes',
            label: 'Product types you sell',
            type: 'repeatable',
            placeholder: 'e.g. Bags',
            itemLabel: 'product type',
          },
          { id: 'catalogSize', label: 'Number of products in your catalog', type: 'number', placeholder: '120' },
          { id: 'monthlyOrders', label: 'Number of orders per month', type: 'number', placeholder: '450' },
        ],
      };

      const phase4Marketplace: PhaseConfig = {
        id: 'marketplace_details',
        name: 'How Your Marketplace Works',
        description: 'Commission rates and seller network scale.',
        fields: [
          { 
            id: 'takeRate', 
            label: 'Take rate / commission percentage (%)', 
            type: 'number', 
            placeholder: '10',
            helperTextTemplate: (val) => `You'll keep ${val}% of every sale made through your platform.`,
          },
          {
            id: 'payoutFrequency',
            label: 'Payout frequency to vendors',
            type: 'select',
            options: [
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ],
            helperTextMap: {
              weekly: 'Weekly: vendors get paid every week.',
              monthly: 'Monthly: vendors get paid once a month.',
            },
          },
          { id: 'activeSellers', label: 'Number of active sellers/vendors on your platform', type: 'number', placeholder: '80' },
        ],
      };

      if (basePhases.length >= 5) {
        return [
          basePhases[0], // Basics
          basePhases[1], // Verify
          basePhases[2], // Sell Type
          sellModel === 'marketplace' ? phase4Marketplace : phase4Store, // Phase 4 Branch
          basePhases[4], // Revenue
        ];
      }

      return [
        phase4Store,
      ];
    },
  },

  other: {
    id: 'other',
    title: 'Custom Business',
    phases: [
      {
        id: 'basics',
        name: 'The Basics',
        description: 'Provide foundational business details.',
        fields: [
          { id: 'businessName', label: 'Business name', type: 'text', placeholder: 'Acme Services LLC' },
          { id: 'logo', label: 'Logo upload', type: 'file', optional: true, helperText: 'Upload PNG or SVG (max 2MB)' },
          { id: 'websiteUrl', label: 'Website URL', type: 'url', optional: true, placeholder: 'https://acme.com' },
        ],
      },
      {
        id: 'verify',
        name: 'Verify Your Business',
        description: 'Provide official details for verification & compliance.',
        fields: [
          { id: 'registrationNumber', label: 'Company registration number', type: 'text', optional: true, placeholder: 'REG-123456' },
          { id: 'country', label: 'Country of registration', type: 'country_select', placeholder: 'Search or select your country...' },
          { id: 'businessEmail', label: 'Business email', type: 'email', placeholder: 'hello@acme.com' },
        ],
      },
      {
        id: 'what_you_do',
        name: 'What You Do',
        description: 'Tell us about your core offerings and operations.',
        fields: [
          { id: 'businessDesc', label: 'One-line description of your business', type: 'textarea', placeholder: 'e.g. Real estate agency specializing in luxury property sales and legal advisory' },
          {
            id: 'offeringsList',
            label: 'Services or offerings',
            type: 'repeatable',
            placeholder: 'e.g. Property Sales',
            itemLabel: 'service or offering',
          },
        ],
      },
      {
        id: 'your_customers',
        name: 'Your Customers',
        description: 'Overview of customer volume and payment structures.',
        fields: [
          { id: 'activeClients', label: 'Number of active clients/customers', type: 'number', placeholder: '25' },
          {
            id: 'paymentMethod',
            label: 'How do you typically get paid?',
            type: 'select',
            options: [
              { label: 'Per project or job', value: 'project_job' },
              { label: 'Recurring', value: 'recurring' },
              { label: 'One-time payments', value: 'onetime' },
              { label: 'Mixed', value: 'mixed' },
            ],
            helperTextMap: {
              project_job: 'Per project or job: you get paid once work is completed.',
              recurring: 'Recurring: customers pay you on a regular schedule.',
              onetime: 'One-time payments: each sale or transaction stands alone.',
              mixed: 'Mixed: a combination of the above.',
            },
          },
          { id: 'teamSize', label: 'Number of people on your team', type: 'number', placeholder: '5' },
        ],
      },
      {
        id: 'revenue',
        name: 'Revenue Snapshot',
        description: 'Current business revenue snapshot.',
        fields: [
          { id: 'monthlyRevenue', label: 'Monthly revenue ($)', type: 'number', placeholder: '10000' },
          { id: 'yearlyRevenue', label: 'Yearly revenue ($)', type: 'number', placeholder: '120000', autoEstimateFrom: 'monthlyRevenue' },
        ],
      },
    ],
  },
};
