'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import ConfirmationDialog from './confirmation-dialog';

export default function AppSidebar() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.getUser.queryOptions());
  const { data: threads } = useQuery(trpc.getThreads.queryOptions());

  const pendingThreads = useMutationState({
    filters: { mutationKey: trpc.sendMessage.mutationKey(), status: 'pending' },
    select: (mutation) =>
      mutation.state.variables as { threadId: string; content: string },
  });

  const queryClient = useQueryClient();
  const { mutate: deleteThread } = useMutation(
    trpc.deleteThread.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.getThreads.queryKey(),
        }),
    })
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href='/' className='mx-auto font-semibold text-xl font-mono'>
          T4.chat
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='gap-2 top-0'>
          <Button className='font-semibold' asChild>
            <Link href='/'>New Chat</Link>
          </Button>
          <div className='relative border-b-border border-b'>
            <Search className='absolute left-2 top-1/2 -translate-y-1/2 size-4.5' />
            <Input
              className='border-none focus-visible:ring-0 pl-9.5'
              placeholder='Search your threads...'
            />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          {/* TODO: grouping by date */}
          <SidebarGroupLabel>Today</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pendingThreads.map((thread) => (
                <SidebarMenuItem key={thread.threadId}>
                  <SidebarMenuButton asChild>
                    <Link href={`/threads/${thread.threadId}`}>
                      <span>New Thread</span>
                      <Loader2 className='size-4 ml-auto animate-spin' />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {threads?.map((thread) => (
                // TODO: Extract as custom component
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      className='group/thread'
                      href={`/threads/${thread.id}`}
                    >
                      <span>{thread.title}</span>
                      <div className='group-hover/thread:flex hidden ml-auto items-center gap-2'>
                        <ConfirmationDialog
                          title='Delete Thread'
                          description={`Are you sure you want to delete "${thread.title}"? This action cannot be undone.`}
                          actionButtonProps={{
                            children: 'Delete',
                            onClick: () => {
                              deleteThread({
                                threadId: thread.id,
                              });
                            },
                          }}
                        >
                          <Button size='icon' variant='link'>
                            <X />
                          </Button>
                        </ConfirmationDialog>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className='sticky bg-sidebar bottom-4 mt-auto'>
          <Link
            href='/settings/subscription'
            className='flex items-center gap-4 hover:bg-white p-2 hover:shadow-xs rounded'
          >
            <Avatar className='size-8.5'>
              <AvatarImage
                src={user?.imageUrl || '/images/avatar-fallback.png'}
              />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col text-start gap-1'>
              <p className='text-sm font-semibold'>
                {user?.username || user?.name}
              </p>
              <p className='text-muted-foreground text-xs'>Free</p>
            </div>
          </Link>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
