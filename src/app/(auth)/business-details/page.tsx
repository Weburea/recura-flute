import { Metadata } from 'next';
import { BusinessDetails } from '@/components/authentication/business-details';

export const metadata: Metadata = {
  title: 'Business Details - Recura Onboarding',
  description: 'Provide your company name, team size, primary currency, and monthly billing volume to finalize your Recura workspace.',
};

export default function BusinessDetailsPage() {
  return <BusinessDetails />;
}
