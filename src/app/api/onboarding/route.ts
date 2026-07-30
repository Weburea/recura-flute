import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession, createSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized session' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { step, businessType, niche, businessName, integrations, gateways } = body;

    const userId = session.userId;

    // 1. Business Basics Step (Step 4 / Final Workspace Creation)
    if (businessName || step === 4) {
      const workspaceName = businessName?.trim() || 'My Recura Business';
      const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;
      const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      await db.insert(schema.workspaces).values({
        id: workspaceId,
        name: workspaceName,
        slug,
        ownerId: userId,
        planId: 'plan_basic', // Auto-assign Free Basic plan
        businessType: businessType || 'saas',
        niche: niche || 'business',
        currency: 'USD',
        timezone: 'UTC',
        onboardingCompleted: true,
      }).onConflictDoNothing();

      await db.insert(schema.userWorkspaces).values({
        id: `uw_${workspaceId}`,
        userId,
        workspaceId,
        role: 'owner',
      }).onConflictDoNothing();

      // Save connected payment gateways
      if (gateways && Array.isArray(gateways)) {
        for (const gateway of gateways) {
          await db.insert(schema.connectedIntegrations).values({
            id: `ci_${gateway}_${workspaceId}`,
            workspaceId,
            provider: gateway,
            category: 'payment_gateway',
            status: 'connected',
          }).onConflictDoNothing();
        }
      }

      // Save connected software integrations
      if (integrations && Array.isArray(integrations)) {
        for (const integration of integrations) {
          await db.insert(schema.connectedIntegrations).values({
            id: `ci_${integration}_${workspaceId}`,
            workspaceId,
            provider: integration,
            category: 'software_integration',
            status: 'connected',
          }).onConflictDoNothing();
        }
      }

      // Update active workspace in session
      await createSession({
        ...session,
        activeWorkspaceId: workspaceId,
      });

      return NextResponse.json({
        success: true,
        workspaceId,
        slug,
        message: 'Workspace created and onboarding completed successfully!',
      });
    }

    // Step Data Save (Steps 1 to 3)
    const progressId = `ob_${userId}`;
    await db.insert(schema.onboardingProgress).values({
      id: progressId,
      userId,
      currentStep: step || 1,
      stepData: { businessType, niche, integrations, gateways },
    }).onConflictDoUpdate({
      target: schema.onboardingProgress.id,
      set: {
        currentStep: step || 1,
        stepData: { businessType, niche, integrations, gateways },
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      step,
      message: 'Onboarding step progress saved.',
    });
  } catch (err) {
    console.error('Onboarding API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error saving onboarding state' },
      { status: 500 }
    );
  }
}
