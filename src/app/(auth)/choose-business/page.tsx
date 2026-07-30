import { Metadata } from 'next';
import { ChooseBusiness } from '@/components/authentication/choose-business';

export const metadata: Metadata = {
  title: 'Choose Your Business - Recura Onboarding',
  description: 'Select your target business model (SaaS, Agency, Enterprise, Startup, Marketplace) to configure your Recura billing workspace.',
};

export default function ChooseBusinessPage() {
  return <ChooseBusiness />;
}
