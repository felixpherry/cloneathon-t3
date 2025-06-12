import AppSidebar from '@/components/common/app-sidebar';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import Prefetcher from '@/components/prefetcher';
import Providers from '@/components/providers';
import { SidebarTrigger } from '@/components/ui/sidebar';
import prisma from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: React.PropsWithChildren) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect('/auth-callback');
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    return redirect('/auth-callback');
  }

  return (
    <Prefetcher>
      <Providers>
        <AppSidebar />
        <SidebarTrigger className='fixed left-4 top-4 z-10' />
        <main className='grow-1 px-2 overflow-auto overscroll-none min-h-svh max-h-svh'>
          <MaxWidthWrapper className='flex flex-col h-full justify-end'>
            {children}
          </MaxWidthWrapper>
        </main>
      </Providers>
    </Prefetcher>
  );
}
