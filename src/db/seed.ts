import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting Recura database schema sync & seeding on Neon PostgreSQL...');

  try {
    // 1. Ensure Table Schema Exists in Neon PostgreSQL
    // Create profiles
    await sql`
      CREATE TABLE IF NOT EXISTS "profiles" (
        "id" varchar(255) PRIMARY KEY,
        "email" text NOT NULL UNIQUE,
        "password_hash" text,
        "full_name" text NOT NULL,
        "avatar_url" text,
        "email_verified" boolean DEFAULT false NOT NULL,
        "email_verified_at" timestamp with time zone,
        "role" text DEFAULT 'owner' NOT NULL,
        "selected_niches" jsonb DEFAULT '[]'::jsonb,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create accounts
    await sql`
      CREATE TABLE IF NOT EXISTS "accounts" (
        "id" varchar(255) PRIMARY KEY,
        "user_id" varchar(255) NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "provider" text NOT NULL,
        "provider_account_id" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create verification_tokens
    await sql`
      CREATE TABLE IF NOT EXISTS "verification_tokens" (
        "id" varchar(255) PRIMARY KEY,
        "identifier" text NOT NULL,
        "code" varchar(6) NOT NULL,
        "type" text NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "attempts" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create plans
    await sql`
      CREATE TABLE IF NOT EXISTS "plans" (
        "id" varchar(255) PRIMARY KEY,
        "name" text NOT NULL,
        "code" text NOT NULL UNIQUE,
        "description" text,
        "features" jsonb DEFAULT '[]'::jsonb,
        "price_monthly" integer DEFAULT 0 NOT NULL,
        "price_yearly" integer DEFAULT 0 NOT NULL,
        "niche_compatibility" jsonb DEFAULT '[]'::jsonb,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create workspaces
    await sql`
      CREATE TABLE IF NOT EXISTS "workspaces" (
        "id" varchar(255) PRIMARY KEY,
        "name" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "owner_id" varchar(255) NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "plan_id" varchar(255) REFERENCES "plans"("id") ON DELETE SET NULL,
        "business_type" text NOT NULL,
        "niche" text,
        "currency" text DEFAULT 'USD' NOT NULL,
        "timezone" text DEFAULT 'UTC' NOT NULL,
        "onboarding_completed" boolean DEFAULT false NOT NULL,
        "settings" jsonb DEFAULT '{}'::jsonb,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create user_workspaces
    await sql`
      CREATE TABLE IF NOT EXISTS "user_workspaces" (
        "id" varchar(255) PRIMARY KEY,
        "user_id" varchar(255) NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "workspace_id" varchar(255) NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "role" text DEFAULT 'owner' NOT NULL,
        "joined_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create connected_integrations
    await sql`
      CREATE TABLE IF NOT EXISTS "connected_integrations" (
        "id" varchar(255) PRIMARY KEY,
        "workspace_id" varchar(255) NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "provider" text NOT NULL,
        "category" text NOT NULL,
        "status" text DEFAULT 'connected' NOT NULL,
        "credentials" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "connected_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Create onboarding_progress
    await sql`
      CREATE TABLE IF NOT EXISTS "onboarding_progress" (
        "id" varchar(255) PRIMARY KEY,
        "user_id" varchar(255) NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "current_step" integer DEFAULT 1 NOT NULL,
        "step_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "completed_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    console.log('✅ Tables created/verified in Neon PostgreSQL.');

    // 2. Seed Default Plans
    console.log('🌱 Seeding Recura subscription plans...');
    await db.insert(schema.plans).values([
      {
        id: 'plan_starter',
        name: 'Starter Plan',
        code: 'starter',
        description: 'For growing businesses and single workspace setups.',
        priceMonthly: 2900,
        priceYearly: 29000,
        features: ['Up to 1,000 active subscriptions', 'Standard payment integrations', 'Basic analytics'],
        nicheCompatibility: ['saas', 'agencies', 'social_media', 'startups', 'marketplaces']
      },
      {
        id: 'plan_pro',
        name: 'Professional Plan',
        code: 'pro',
        description: 'Advanced metrics, automated retainers, and priority support.',
        priceMonthly: 7900,
        priceYearly: 79000,
        features: ['Unlimited active subscriptions', 'All global & African payment gateways', 'Advanced revenue metrics'],
        nicheCompatibility: ['saas', 'agencies', 'social_media', 'startups', 'marketplaces']
      }
    ]).onConflictDoNothing();

    // 3. Seed Demo Owner Profile
    console.log('🌱 Seeding demo user profile...');
    await db.insert(schema.profiles).values({
      id: 'usr_demo_owner',
      email: 'demo@recura.io',
      fullName: 'Amara Okoro',
      avatarUrl: 'https://res.cloudinary.com/weburea/image/upload/v1783571837/profile_icon.png',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      role: 'owner',
      selectedNiches: ['saas', 'agencies', 'social_media', 'startups', 'marketplaces']
    }).onConflictDoNothing();

    // 4. Seed Workspaces for 5 Business Models
    console.log('🌱 Seeding sample business model workspaces...');
    const businessModels = [
      { id: 'ws_saas', name: 'CloudScale SaaS', slug: 'cloudscale-saas', type: 'saas', niche: 'b2b_software' },
      { id: 'ws_agency', name: 'Apex Design Studio', slug: 'apex-design-studio', type: 'agencies', niche: 'design_agency' },
      { id: 'ws_social', name: 'Glow Media Agency', slug: 'glow-media-agency', type: 'social_media', niche: 'influencer_agency' },
      { id: 'ws_startup', name: 'DevPulse Launchpad', slug: 'devpulse-launchpad', type: 'startups', niche: 'tech_startup' },
      { id: 'ws_marketplace', name: 'Urban Craft Store', slug: 'urban-craft-store', type: 'marketplaces', niche: 'e_commerce' },
    ];

    for (const model of businessModels) {
      await db.insert(schema.workspaces).values({
        id: model.id,
        name: model.name,
        slug: model.slug,
        ownerId: 'usr_demo_owner',
        planId: 'plan_pro',
        businessType: model.type,
        niche: model.niche,
        currency: 'USD',
        timezone: 'UTC',
        onboardingCompleted: true,
      }).onConflictDoNothing();

      await db.insert(schema.userWorkspaces).values({
        id: `uw_${model.id}`,
        userId: 'usr_demo_owner',
        workspaceId: model.id,
        role: 'owner',
      }).onConflictDoNothing();

      // Seed Connected Integrations for each workspace
      await db.insert(schema.connectedIntegrations).values([
        {
          id: `ci_stripe_${model.id}`,
          workspaceId: model.id,
          provider: 'stripe',
          category: 'payment_gateway',
          status: 'connected',
        },
        {
          id: `ci_paystack_${model.id}`,
          workspaceId: model.id,
          provider: 'paystack',
          category: 'payment_gateway',
          status: 'connected',
        },
        {
          id: `ci_slack_${model.id}`,
          workspaceId: model.id,
          provider: 'slack',
          category: 'software_integration',
          status: 'connected',
        }
      ]).onConflictDoNothing();
    }

    console.log('🎉 Recura database schema push & seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    process.exit(1);
  }
}

seed();
