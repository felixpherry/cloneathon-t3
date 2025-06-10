import AppSidebar from '@/components/common/app-sidebar';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import PromptInput from '@/components/prompt-input';
import Providers from '@/components/providers';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { requireUserId } from '@/lib/auth';

export default async function Layout({ children }: React.PropsWithChildren) {
  await requireUserId();

  return (
    <Providers>
      <AppSidebar />
      <SidebarTrigger className='fixed left-4 top-4 z-10' />
      <main className='grow-1 px-2 overflow-auto overscroll-none min-h-svh max-h-svh'>
        <MaxWidthWrapper className='flex flex-col h-full'>
          {children}
          <PromptInput className='sticky mx-auto bottom-0 w-full mt-auto' />
        </MaxWidthWrapper>
      </main>
    </Providers>
  );
}
