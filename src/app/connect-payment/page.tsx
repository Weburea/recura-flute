import React from 'react';
import { ConnectPayment } from '@/components/authentication/connect-payment';

export const metadata = {
  title: 'Connect Payment Provider | Recura Onboarding',
  description: 'Connect your Paystack or Stripe account to receive automated payouts.',
};

export default function ConnectPaymentPage() {
  return <ConnectPayment />;
}
