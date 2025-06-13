import React from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Prefetcher({
  children,
}: React.PropsWithChildren) {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      trpc.infiniteThreads.infiniteQueryOptions({})
    ),
    queryClient.prefetchQuery(trpc.getUser.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
