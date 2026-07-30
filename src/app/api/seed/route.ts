import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { success: false, error: 'DATABASE_URL is not set' },
      { status: 500 }
    );
  }

  const sql = neon(databaseUrl);

  try {
    // 1. Ensure Table Schemas Exist in Neon PostgreSQL
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

    await sql`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "password_hash" text;`;
    await sql`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false NOT NULL;`;
    await sql`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "email_verified_at" timestamp with time zone;`;
    await sql`ALTER TABLE "verification_tokens" ALTER COLUMN "code" TYPE text;`;

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

    await sql`ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "business_type" text DEFAULT 'saas';`;
    await sql`ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "niche" text;`;
    await sql`ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "currency" text DEFAULT 'USD' NOT NULL;`;
    await sql`ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "timezone" text DEFAULT 'UTC' NOT NULL;`;
    await sql`ALTER TABLE "workspaces" ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false NOT NULL;`;

    await sql`
      CREATE TABLE IF NOT EXISTS "user_workspaces" (
        "id" varchar(255) PRIMARY KEY,
        "user_id" varchar(255) NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "workspace_id" varchar(255) NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
        "role" text DEFAULT 'owner' NOT NULL,
        "joined_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

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

    // 2. Clean up old leftover plans (plan_pro, plan_starter)
    await sql`UPDATE "workspaces" SET "plan_id" = 'plan_growth' WHERE "plan_id" IN ('plan_pro', 'plan_starter');`;
    await sql`DELETE FROM "plans" WHERE "id" NOT IN ('plan_basic', 'plan_growth', 'plan_business');`;

    // 3. Seed/Update 3 Actual Recura Pricing Plans: BASIC (FREE), GROWTH ($49), and BUSINESS ($999)
    await sql`
      INSERT INTO "plans" ("id", "name", "code", "description", "price_monthly", "price_yearly", "features", "niche_compatibility")
      VALUES
        ('plan_basic', 'Basic Plan', 'basic', 'For small teams getting started. Free forever.', 0, 0, '["Up to 100 customers", "Unlimited invoices", "2 payment gateways", "Basic analytics dashboard", "Email support"]'::jsonb, '["saas", "agencies", "social_media", "startups", "marketplaces"]'::jsonb),
        ('plan_growth', 'Growth Plan', 'growth', 'For growing businesses scaling recurring revenue.', 4900, 3900, '["Up to 1,000 customers", "All payment gateways", "Automated dunning & retries", "Advanced analytics & MRR", "5 team members", "Priority chat support"]'::jsonb, '["saas", "agencies", "social_media", "startups", "marketplaces"]'::jsonb),
        ('plan_business', 'Business Plan', 'business', 'For large teams with advanced enterprise needs.', 99900, 79900, '["Unlimited customers", "Custom integrations", "Dedicated account manager", "SLA & uptime guarantee", "White-label invoicing"]'::jsonb, '["saas", "agencies", "social_media", "startups", "marketplaces"]'::jsonb)
      ON CONFLICT ("id") DO UPDATE SET
        "name" = EXCLUDED."name",
        "description" = EXCLUDED."description",
        "price_monthly" = EXCLUDED."price_monthly",
        "price_yearly" = EXCLUDED."price_yearly",
        "features" = EXCLUDED."features";
    `;

    // 4. Seed Demo Owner Profile
    await sql`
      INSERT INTO "profiles" ("id", "email", "full_name", "avatar_url", "email_verified", "email_verified_at", "role", "selected_niches")
      VALUES
        ('usr_demo_owner', 'demo@recura.io', 'Amara Okoro', 'https://res.cloudinary.com/weburea/image/upload/v1783571837/profile_icon.png', true, now(), 'owner', '["saas", "agencies", "social_media", "startups", "marketplaces"]'::jsonb)
      ON CONFLICT ("id") DO NOTHING;
    `;

    // 5. Seed Workspaces & Integrations for 5 Business Models
    await sql`
      INSERT INTO "workspaces" ("id", "name", "slug", "owner_id", "plan_id", "business_type", "niche", "currency", "timezone", "onboarding_completed")
      VALUES
        ('ws_saas', 'CloudScale SaaS', 'cloudscale-saas', 'usr_demo_owner', 'plan_growth', 'saas', 'b2b_software', 'USD', 'UTC', true),
        ('ws_agency', 'Apex Design Studio', 'apex-design-studio', 'usr_demo_owner', 'plan_growth', 'agencies', 'design_agency', 'USD', 'UTC', true),
        ('ws_social', 'Glow Media Agency', 'glow-media-agency', 'usr_demo_owner', 'plan_growth', 'social_media', 'influencer_agency', 'USD', 'UTC', true),
        ('ws_startup', 'DevPulse Launchpad', 'devpulse-launchpad', 'usr_demo_owner', 'plan_growth', 'startups', 'tech_startup', 'USD', 'UTC', true),
        ('ws_marketplace', 'Urban Craft Store', 'urban-craft-store', 'usr_demo_owner', 'plan_growth', 'marketplaces', 'e_commerce', 'USD', 'UTC', true)
      ON CONFLICT ("id") DO NOTHING;
    `;

    await sql`
      INSERT INTO "user_workspaces" ("id", "user_id", "workspace_id", "role")
      VALUES
        ('uw_ws_saas', 'usr_demo_owner', 'ws_saas', 'owner'),
        ('uw_ws_agency', 'usr_demo_owner', 'ws_agency', 'owner'),
        ('uw_ws_social', 'usr_demo_owner', 'ws_social', 'owner'),
        ('uw_ws_startup', 'usr_demo_owner', 'ws_startup', 'owner'),
        ('uw_ws_marketplace', 'usr_demo_owner', 'ws_marketplace', 'owner')
      ON CONFLICT ("id") DO NOTHING;
    `;

    await sql`
      INSERT INTO "connected_integrations" ("id", "workspace_id", "provider", "category", "status")
      VALUES
        ('ci_stripe_ws_saas', 'ws_saas', 'stripe', 'payment_gateway', 'connected'),
        ('ci_paystack_ws_saas', 'ws_saas', 'paystack', 'payment_gateway', 'connected'),
        ('ci_slack_ws_saas', 'ws_saas', 'slack', 'software_integration', 'connected'),
        ('ci_stripe_ws_agency', 'ws_agency', 'stripe', 'payment_gateway', 'connected'),
        ('ci_paystack_ws_agency', 'ws_agency', 'paystack', 'payment_gateway', 'connected'),
        ('ci_slack_ws_agency', 'ws_agency', 'slack', 'software_integration', 'connected')
      ON CONFLICT ("id") DO NOTHING;
    `;

    return NextResponse.json({
      success: true,
      message: 'Cleaned up old plan rows. Recura database now contains exactly 3 pricing plans: BASIC (Free), GROWTH ($49), and BUSINESS ($999)!',
      plans: ['plan_basic', 'plan_growth', 'plan_business']
    });
  } catch (err) {
    console.error('Database migration/seed error:', err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
