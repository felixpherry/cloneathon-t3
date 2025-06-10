'use client';

import React from 'react';
import { SidebarProvider } from './ui/sidebar';
import PromptInputProvider from './prompt-input-provider';

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <PromptInputProvider>{children}</PromptInputProvider>
    </SidebarProvider>
  );
}
