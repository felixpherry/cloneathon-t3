'use client';

import superjson from 'superjson';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './_app';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { makeQueryClient } from './query-client';
import React from 'react';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  const base = (() => {
    if (typeof window === 'undefined') return '';
    if (process.env.APP_BASE_URL) return `https://${process.env.APP_BASE_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

export function TRPCReactProvider(
  props: Readonly<{ children: React.ReactNode }>
) {
  const queryClient = getQueryClient();
  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: getUrl(),
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
