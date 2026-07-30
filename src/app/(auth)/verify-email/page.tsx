import { Metadata } from 'next';
import { VerifyEmail } from '@/components/authentication/verify-email';

export const metadata: Metadata = {
  title: 'Verify Email - Recura Onboarding',
  description: 'Enter your 6-digit verification code to confirm your Recura account.',
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
