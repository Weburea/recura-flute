export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category?: string;
  alreadyConnected?: boolean;
}

const META_SVG_DATA_URL = `data:image/svg+xml;utf8,<svg viewBox="0 0 287.59 191" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" gradientTransform="matrix(1 0 0 -1 0 192)" gradientUnits="userSpaceOnUse" x1="62.34" x2="260.34" y1="101.45" y2="91.45"><stop offset="0" stop-color="%230064e1"/><stop offset=".4" stop-color="%230064e1"/><stop offset=".83" stop-color="%230073ee"/><stop offset="1" stop-color="%230082fb"/></linearGradient><linearGradient id="b" gradientTransform="matrix(1 0 0 -1 0 192)" gradientUnits="userSpaceOnUse" x1="41.42" x2="41.42" y1="53" y2="126"><stop offset="0" stop-color="%230082fb"/><stop offset="1" stop-color="%230064e0"/></linearGradient><path d="M31.06 126c0 11 2.41 19.41 5.56 24.51A19 19 0 0 0 53.19 160c8.1 0 15.51-2 29.79-21.76 11.44-15.83 24.92-38 34-52l15.36-23.6c10.67-16.39 23-34.61 37.18-47C181.07 5.6 193.54 0 206.09 0c21.07 0 41.14 12.21 56.5 35.11 16.81 25.08 25 56.67 25 89.27 0 19.38-3.82 33.62-10.32 44.87C271 180.13 258.72 191 238.13 191v-31c17.63 0 22-16.2 22-34.74 0-26.42-6.16-55.74-19.73-76.69-9.63-14.86-22.11-23.94-35.84-23.94-14.85 0-26.8 11.2-40.23 31.17-7.14 10.61-14.47 23.54-22.7 38.13l-9.06 16c-18.2 32.27-22.81 39.62-31.91 51.75C84.74 183 71.12 191 53.19 191c-21.27 0-34.72-9.21-43-23.09C3.34 156.6 0 141.76 0 124.85z" fill="%230081fb"/><path d="M24.49 37.3C38.73 15.35 59.28 0 82.85 0c13.65 0 27.22 4 41.39 15.61 15.5 12.65 32 33.48 52.63 67.81l7.39 12.32c17.84 29.72 28 45 33.93 52.22 7.64 9.26 13 12 19.94 12 17.63 0 22-16.2 22-34.74l27.4-.86c0 19.38-3.82 33.62-10.32 44.87C271 180.13 258.72 191 238.13 191c-12.8 0-24.14-2.78-36.68-14.61-9.64-9.08-20.91-25.21-29.58-39.71L146.08 93.6c-12.94-21.62-24.81-37.74-31.68-45-7.4-7.89-16.89-17.37-32.05-17.37-12.27 0-22.69 8.61-31.41 21.78z" fill="url(%23a)"/><path d="M82.35 31.23c-12.27 0-22.69 8.61-31.41 21.78C38.61 71.62 31.06 99.34 31.06 126c0 11 2.41 19.41 5.56 24.51l-26.48 17.4C3.34 156.6 0 141.76 0 124.85 0 94.1 8.44 62.05 24.49 37.3 38.73 15.35 59.28 0 82.85 0z" fill="url(%23b)"/></svg>`;

const CALENDLY_SVG_DATA_URL = `data:image/svg+xml;utf8,<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><g fill-rule="nonzero"><path d="M346.955 330.224c-15.875 14.088-35.7 31.619-71.647 31.619h-21.495c-26.012 0-49.672-9.455-66.607-26.593-16.543-16.747-25.649-39.665-25.649-64.545v-29.41c0-24.88 9.106-47.799 25.65-64.545 16.934-17.138 40.594-26.579 66.606-26.579h21.495c35.99 0 55.772 17.516 71.647 31.604 16.484 14.524 30.703 27.218 68.625 27.218a109.162 109.162 0 0017.269-1.38l-.13-.334a129.909 129.909 0 00-7.974-16.382L399.4 146.99c-23.232-40.234-66.304-65.098-112.763-65.096h-50.703c-46.46-.002-89.531 24.862-112.764 65.096l-25.344 43.906c-23.224 40.238-23.224 89.968 0 130.206l25.344 43.906c23.233 40.234 66.305 65.098 112.764 65.096h50.703c46.459.002 89.53-24.862 112.763-65.096l25.345-43.833a129.909 129.909 0 007.973-16.383l.13-.32a107.491 107.491 0 00-17.268-1.452c-37.922 0-52.14 12.621-68.625 27.218" fill="%23006bff"/><path d="M275.308 176.823h-21.495c-39.592 0-65.605 28.278-65.605 64.471v29.411c0 36.194 26.013 64.472 65.605 64.472h21.495c57.69 0 53.158-58.822 140.272-58.822 8.254-.009 16.49.75 24.603 2.266a130.047 130.047 0 000-45.242 134.431 134.431 0 01-24.603 2.266c-87.143 0-82.583-58.822-140.272-58.822" fill="%23006bff"/><path d="M490.233 300.116a121.451 121.451 0 00-50.035-21.51v.436a130.296 130.296 0 01-7.262 25.344 95.25 95.25 0 0141.364 17.037c0 .116-.072.261-.116.392-28.788 93.217-115.55 157.228-213.112 157.228-122.358 0-223.044-100.685-223.044-223.043S138.714 32.956 261.072 32.956c97.561 0 184.324 64.012 213.112 157.229 0 .13.073.276.116.392a95.073 95.073 0 01-41.364 17.022 131.112 131.112 0 017.262 25.373 3.166 3.166 0 000 .407 121.415 121.415 0 0050.035-21.495c14.262-10.56 11.503-22.483 9.339-29.542C467.34 77.803 370.064 6 260.67 6c-137.147 0-250 112.854-250 250 0 137.146 112.853 250 250 250 109.394 0 206.67-71.803 238.902-176.342 2.164-7.059 4.923-18.983-9.34-29.542" fill="%23006bff"/><path d="M432.849 207.599a107.491 107.491 0 01-17.269 1.452c-37.922 0-52.14-12.62-68.61-27.217-15.89-14.089-35.672-31.619-71.662-31.619h-21.495c-26.027 0-49.672 9.455-66.607 26.593-16.543 16.746-25.649 39.665-25.649 64.545v29.41c0 24.88 9.106 47.799 25.65 64.545 16.934 17.138 40.579 26.578 66.606 26.578h21.495c35.99 0 55.772-17.515 71.661-31.604 16.47-14.524 30.69-27.217 68.611-27.217 5.783.001 11.558.463 17.269 1.38a129.303 129.303 0 007.262-25.345c.009-.145.009-.29 0-.436a134.301 134.301 0 00-24.604-2.25c-87.143 0-82.583 58.836-140.271 58.836H253.74c-39.592 0-65.604-28.293-65.604-64.487v-29.469c0-36.193 26.012-64.471 65.604-64.471h21.496c57.688 0 53.157 58.807 140.271 58.807 8.254.015 16.49-.74 24.604-2.251v-.407a131.112 131.112 0 00-7.262-25.373" fill="%230ae8f0"/></g></svg>`;

export const UNIVERSAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'See and reply to your email inbox without leaving Recura.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130775/images/integration-icons/gmail.png',
  },
  {
    id: 'gcalendar',
    name: 'Google Calendar',
    description: 'Sync your meetings and events.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785129903/images/integration-icons/gcalendar.svg',
  },
  {
    id: 'gmeet',
    name: 'Google Meet',
    description: 'Auto-generate video call links for your meetings.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785129935/images/integration-icons/gmeet.svg',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get instant alerts for payments, failures, and low stock.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785129978/images/integration-icons/slack.svg',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect Recura to thousands of other apps you already use.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130016/images/integration-icons/zapier.svg',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Link your notes or project docs into your workspace.',
    logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130041/images/integration-icons/notion.svg',
  },
];

export const NICHE_INTEGRATIONS: Record<string, IntegrationItem[]> = {
  saas: [
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Automatically sync your invoices and payments into your books.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130075/images/integration-icons/quickbooks.svg',
    },
  ],

  agencies: [
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Track your clients and deals in one place.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130108/images/integration-icons/hubspot.svg',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect your LinkedIn for client outreach.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130140/images/integration-icons/linkedin.svg',
    },
    {
      id: 'calendly',
      name: 'Calendly',
      description: 'Let clients book meetings with you directly.',
      logoUrl: CALENDLY_SVG_DATA_URL,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      description: 'Message clients directly from Recura.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130193/images/integration-icons/whatsapp.svg',
    },
    {
      id: 'trello_asana',
      name: 'Trello or Asana',
      description: 'Track client work and team tasks.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130233/images/integration-icons/trello.svg',
    },
  ],

  social_media: [
    {
      id: 'facebook_instagram',
      name: 'Facebook & Instagram',
      description: 'See follower counts and page performance for your connected accounts.',
      logoUrl: META_SVG_DATA_URL,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Connect your LinkedIn company page.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130140/images/integration-icons/linkedin.svg',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      description: 'Message clients and leads directly from Recura.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130193/images/integration-icons/whatsapp.svg',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Track client campaigns and deals.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130108/images/integration-icons/hubspot.svg',
    },
    {
      id: 'calendly',
      name: 'Calendly',
      description: 'Let clients or leads book calls with you directly.',
      logoUrl: CALENDLY_SVG_DATA_URL,
    },
  ],

  startups: [
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Track your early customers and deals.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130108/images/integration-icons/hubspot.svg',
    },
    {
      id: 'trello_asana',
      name: 'Trello or Asana',
      description: "Manage your team's tasks and sprints.",
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130233/images/integration-icons/trello.svg',
    },
  ],

  marketplaces: [
    {
      id: 'shopify',
      name: 'Shopify',
      description: "Sync your store's products and orders.",
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130287/images/integration-icons/shopify.svg',
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Sync your order revenue into your books.',
      logoUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785130075/images/integration-icons/quickbooks.svg',
    },
  ],

  other: [],
};

/**
 * Returns complete integration list for a niche, handling Shopify de-duplication if already selected in Step 4.
 */
export function getIntegrationsForNiche(nicheId: string, isShopifyAlreadySelected: boolean = false): IntegrationItem[] {
  const nicheAdditions = NICHE_INTEGRATIONS[nicheId] || NICHE_INTEGRATIONS['other'] || [];
  
  const processedNicheAdditions = nicheAdditions.map(item => {
    if (item.id === 'shopify' && isShopifyAlreadySelected) {
      return { ...item, alreadyConnected: true };
    }
    return item;
  });

  return [...UNIVERSAL_INTEGRATIONS, ...processedNicheAdditions];
}
