'use client';

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data, error } = useQuery({
    ...trpc.authCallback.queryOptions(),
    retry: false,
  });

  if (error?.data?.code === 'UNAUTHORIZED') {
    router.push('/api/auth/login');
  } else if (data) {
    router.push('/');
  }

  return (
    <div className='flex items-center justify-center h-svh flex-col gap-2'>
      <Loader2 className='size-8 animate-spin text-zinc-800' />
      <h3 className='font-semibold text-xl'>Setting up your account...</h3>
      <p className='text-muted-foreground'>
        You will be redirected automatically
      </p>
    </div>
  );
}
