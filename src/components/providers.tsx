'use client';

import React from 'react';
import { SidebarProvider } from './ui/sidebar';

export default function Providers({ children }: React.PropsWithChildren) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
