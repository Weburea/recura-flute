/**
 * ─────────────────────────────────────────────────────────────────────────────
 * RECURA - AUTHENTICATION & DATABASE BYPASS CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Purpose:
 * Allows the product design team and stakeholders to review and interact with
 * the complete onboarding workflow (Sign-Up -> Verify-Email -> Choose Business ->
 * Business Details -> Connect Payment -> Connect Integrations -> Completion
 * Summary -> Dashboard) without requiring live database credentials, email
 * delivery service, or persistent backend storage.
 *
 * HOW TO REVERT TO NORMAL PRODUCTION STATE:
 * 1. Change `AUTH_BYPASS_ENABLED = false;` below, OR
 * 2. Set the environment variable `NEXT_PUBLIC_AUTH_BYPASS=false`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const AUTH_BYPASS_ENABLED = true;

export const AUTH_BYPASS_CONFIG = {
  /** Master switch to enable or disable the auth & database bypass */
  enabled: AUTH_BYPASS_ENABLED,

  /** Default mock user when signing up or bypassing authentication */
  defaultUser: {
    id: 'usr_demo_designer',
    email: 'designer@recura.io',
    fullName: 'Alex Morgan',
    role: 'owner',
    avatarUrl: 'https://res.cloudinary.com/weburea/image/upload/v1785018485/images/avatar/ellipse_1095.png',
    phone: '+1 (555) 234-5678',
    jobTitle: 'Product Design Lead',
    timezone: 'America/New_York',
    language: 'en',
    hasPassword: true,
    twoFactorEnabled: false,
    providers: ['credentials'],
  },

  /** Default fallback workspace when none is configured yet */
  defaultWorkspace: {
    id: 'ws_demo_workspace',
    name: 'Acme SaaS Inc.',
    businessType: 'saas',
    niche: 'saas',
    settings: {
      welcome_seen: true,
      currency: 'USD',
      timezone: 'America/New_York',
    },
    metadata: {
      monthlyRevenue: 18420,
      yearlyRevenue: 221040,
      activeCustomers: 312,
      teamSize: 8,
      avgPricePerCustomer: 99,
      billingModel: 'Flat price',
      billingFrequency: 'Monthly',
    },
  },

  /** The route to jump directly to from Sign-Up when bypass is active */
  onboardingEntryRoute: '/choose-business',
};

/**
 * Configure mock session in browser cookies and localStorage/sessionStorage
 * so that both Edge middleware and client components recognize an authenticated user.
 */
export function setupBypassSession(overrides?: {
  fullName?: string;
  email?: string;
  businessType?: string;
  businessName?: string;
}): void {
  if (typeof window === 'undefined') return;

  const fullName = overrides?.fullName?.trim() || AUTH_BYPASS_CONFIG.defaultUser.fullName;
  const email = overrides?.email?.trim() || AUTH_BYPASS_CONFIG.defaultUser.email;
  const userId = AUTH_BYPASS_CONFIG.defaultUser.id;
  const role = AUTH_BYPASS_CONFIG.defaultUser.role;

  // 1. Save user details in Web Storage
  localStorage.setItem('recura_user_name', fullName);
  localStorage.setItem('recura_user_email', email);
  localStorage.setItem('recura_user_id', userId);
  localStorage.setItem('recura_auth_bypassed', 'true');

  sessionStorage.setItem('recura_user_name', fullName);
  sessionStorage.setItem('recura_user_email', email);
  sessionStorage.setItem('recura_user_id', userId);
  sessionStorage.setItem('recura_auth_bypassed', 'true');

  if (overrides?.businessType) {
    localStorage.setItem('recura_business_type', overrides.businessType);
    sessionStorage.setItem('recura_business_type', overrides.businessType);
  }

  if (overrides?.businessName) {
    localStorage.setItem('recura_business_name', overrides.businessName);
    sessionStorage.setItem('recura_business_name', overrides.businessName);
  }

  // 2. Set the `recura_session` cookie for Next.js Middleware and server components
  const sessionPayload = {
    userId,
    email,
    fullName,
    role,
    activeWorkspaceId: AUTH_BYPASS_CONFIG.defaultWorkspace.id,
  };

  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(sessionPayload))));
    // Set 7-day cookie across all paths
    document.cookie = `recura_session=${encoded}; path=/; max-age=604800; SameSite=Lax`;
  } catch (err) {
    console.warn('[AUTH BYPASS] Failed to encode cookie:', err);
  }
}

/**
 * Retrieve the active mock user and workspace dynamically populated
 * from the user's onboarding choices stored in localStorage.
 */
export function getBypassUserAndWorkspace() {
  if (typeof window === 'undefined') {
    return {
      user: AUTH_BYPASS_CONFIG.defaultUser,
      workspace: AUTH_BYPASS_CONFIG.defaultWorkspace,
    };
  }

  const storedName = localStorage.getItem('recura_user_name') || sessionStorage.getItem('recura_user_name');
  const storedEmail = localStorage.getItem('recura_user_email') || sessionStorage.getItem('recura_user_email');
  const storedBusinessType = localStorage.getItem('recura_business_type') || sessionStorage.getItem('recura_business_type');
  const storedBusinessName = localStorage.getItem('recura_business_name') || sessionStorage.getItem('recura_business_name');

  let step4FormData: Record<string, unknown> = {};
  try {
    const raw = localStorage.getItem('recura_step4_formdata') || sessionStorage.getItem('recura_step4_formdata');
    if (raw) step4FormData = JSON.parse(raw);
  } catch {
    step4FormData = {};
  }

  const activeType = storedBusinessType || 'saas';
  const activeName = storedBusinessName || (step4FormData.businessName as string) || (step4FormData.agencyName as string) || AUTH_BYPASS_CONFIG.defaultWorkspace.name;

  const user = {
    ...AUTH_BYPASS_CONFIG.defaultUser,
    fullName: storedName || AUTH_BYPASS_CONFIG.defaultUser.fullName,
    email: storedEmail || AUTH_BYPASS_CONFIG.defaultUser.email,
  };

  const workspace = {
    id: AUTH_BYPASS_CONFIG.defaultWorkspace.id,
    name: activeName,
    businessType: activeType,
    niche: activeType,
    settings: {
      welcome_seen: true,
      currency: (step4FormData.currency as string) || 'USD',
    },
    metadata: {
      ...step4FormData,
      monthlyRevenue: Number(step4FormData.monthlyRevenue) || 18420,
      yearlyRevenue: Number(step4FormData.yearlyRevenue) || 221040,
      activeCustomers: Number(step4FormData.activeCustomers || step4FormData.activeClients) || 312,
      teamSize: Number(step4FormData.teamSize) || 8,
    },
  };

  return { user, workspace };
}

/**
 * Clear the bypass session cookie and storage
 */
export function clearBypassSession(): void {
  if (typeof window === 'undefined') return;

  document.cookie = 'recura_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  localStorage.removeItem('recura_auth_bypassed');
  sessionStorage.removeItem('recura_auth_bypassed');
}
