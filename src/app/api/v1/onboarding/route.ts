import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { authenticateRequest } from '@/lib/auth';
import { getSession, createSession } from '@/lib/session';
import crypto from 'crypto';
import { AUTH_BYPASS_CONFIG } from '@/config/auth-bypass';

export async function POST(request: Request) {
  try {
    if (AUTH_BYPASS_CONFIG.enabled) {
      return NextResponse.json({
        success: true,
        message: 'Workspace onboarding completed successfully (preview mode)',
      });
    }

    const authResult = await authenticateRequest();

    if (!authResult.isAuthenticated || !authResult.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json() as {
      step?: number;
      businessType?: string;
      niche?: string;
      businessName?: string;
      logo_url?: string;
      logoUrl?: string;
      website_url?: string;
      websiteUrl?: string;
      integrations?: string[];
      gateways?: string[];
      metadata?: Record<string, unknown>;
    };
    const { 
      step, 
      businessType, 
      niche, 
      businessName, 
      logo_url, 
      logoUrl, 
      website_url, 
      websiteUrl, 
      integrations, 
      gateways,
      metadata
    } = body;

    const userId = authResult.userId;
    let finalLogoUrl = logo_url || logoUrl || (metadata?.logo_url as string) || (metadata?.logoUrl as string) || (metadata?.logo as string) || null;
    const finalWebsiteUrl = website_url || websiteUrl || (metadata?.website_url as string) || (metadata?.websiteUrl as string) || null;

    // Handle Cloudinary upload if base64 logo is provided
    if (finalLogoUrl && finalLogoUrl.startsWith('data:')) {
      try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'weburea';
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (apiKey && apiSecret) {
          const timestamp = Math.round(new Date().getTime() / 1000).toString();
          const folder = 'Recure assets/images/logos';
          const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
          const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append('file', finalLogoUrl);
          cloudinaryFormData.append('folder', folder);
          cloudinaryFormData.append('timestamp', timestamp);
          cloudinaryFormData.append('api_key', apiKey);
          cloudinaryFormData.append('signature', signature);

          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
          const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: cloudinaryFormData,
          });

          if (response.ok) {
            const result = await response.json();
            finalLogoUrl = result.secure_url;
          } else {
            console.error('[CLOUDINARY ONBOARDING ERROR] Upload failed:', await response.text());
          }
        }
      } catch (uploadErr) {
        console.error('[CLOUDINARY ONBOARDING ERROR] Exception during upload:', uploadErr);
      }
    }

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
        niche: niche || 'saas_marketing',
        currency: 'USD',
        timezone: 'UTC',
        onboardingCompleted: true,
        metadata: {
          ...metadata,
          logo_url: finalLogoUrl,
          website_url: finalWebsiteUrl,
          niche: niche || (metadata?.niche as string) || 'saas_marketing',
        }
      }).onConflictDoNothing();

      await db.insert(schema.userWorkspaces).values({
        id: `uw_${workspaceId}`,
        userId,
        workspaceId,
        role: 'owner',
      }).onConflictDoNothing();

      // Save connected payment gateways (up to limit of 2)
      if (gateways && Array.isArray(gateways)) {
        const limitedGateways = gateways.slice(0, 2);
        for (const gateway of limitedGateways) {
          await db.insert(schema.connectedIntegrations).values({
            id: `ci_${gateway}_${workspaceId}`,
            workspaceId,
            provider: gateway,
            category: 'payment_gateway',
            status: 'connected',
          }).onConflictDoNothing();
        }
      }

      // Save connected software integrations (up to limit of 2)
      if (integrations && Array.isArray(integrations)) {
        const limitedIntegrations = integrations.slice(0, 2);
        for (const integration of limitedIntegrations) {
          await db.insert(schema.connectedIntegrations).values({
            id: `ci_${integration}_${workspaceId}`,
            workspaceId,
            provider: integration,
            category: 'software_integration',
            status: 'connected',
          }).onConflictDoNothing();
        }
      }

      // Update active workspace in session if authenticated via session cookie
      if (authResult.authType === 'cookie') {
        const session = await getSession();
        if (session) {
          await createSession({
            ...session,
            activeWorkspaceId: workspaceId,
          });
        }
      }

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
      stepData: { businessType, niche, integrations, gateways, logoUrl: finalLogoUrl, websiteUrl: finalWebsiteUrl },
    }).onConflictDoUpdate({
      target: schema.onboardingProgress.id,
      set: {
        currentStep: step || 1,
        stepData: { businessType, niche, integrations, gateways, logoUrl: finalLogoUrl, websiteUrl: finalWebsiteUrl },
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
