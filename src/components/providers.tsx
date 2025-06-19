'use client';

import React from 'react';
import { SidebarProvider } from './ui/sidebar';
import { TooltipProvider } from './ui/tooltip';
import { ModelProvider } from './model-provider';

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ModelProvider>
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
    </ModelProvider>
  );
}
