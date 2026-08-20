'use client';

import React from 'react';
import { UserProvider } from '@/context/user-context';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
