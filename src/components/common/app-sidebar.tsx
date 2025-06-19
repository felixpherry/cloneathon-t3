'use client';

import { produce } from 'immer';
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
import { Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTRPC } from '@/trpc/client';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import ConfirmationDialog from './confirmation-dialog';
import useIntersectionObserver from '@/hooks/use-intersection-observer';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';
import { DateTime } from 'luxon';
import { Thread } from '@/app/generated/prisma';
import SearchInput from './search-input';

type DateCategory = 'Today' | 'This week' | 'More than a week ago';

export default function AppSidebar() {
  const [search, setSearch] = React.useState<string | undefined>();
  const debouncedSearch = useDebounce(search, 100);
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.getUser.queryOptions());
  const {
    data: threadsResponse,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    trpc.infiniteThreads.infiniteQueryOptions(
      {
        search: debouncedSearch,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      }
    )
  );
  const queryKey = trpc.infiniteThreads.infiniteQueryKey({});
  const flattenThreads = threadsResponse?.pages.flatMap(
    ({ threads }) => threads
  );
  const now = DateTime.now();
  const startOfToday = now.startOf('day');
  const startOfWeek = now.startOf('week');
  const mapDateCategoryToThreads = flattenThreads?.reduce(
    (acc, thread) => {
      const created = DateTime.fromJSDate(thread.createdAt);
      if (created >= startOfToday) {
        return {
          ...acc,
          Today: [...acc.Today, thread],
        };
      } else if (created >= startOfWeek) {
        return {
          ...acc,
          'This week': [...acc['This week'], thread],
        };
      } else {
        return {
          ...acc,
          'More than a week ago': [...acc['More than a week ago'], thread],
        };
      }
    },
    {
      Today: [],
      'This week': [],
      'More than a week ago': [],
    } as Record<DateCategory, Thread[]>
  );

  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();
  const { mutate: deleteThread } = useMutation(
    trpc.deleteThread.mutationOptions({
      // Always refetch after error or successs
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey,
        }),
      onMutate: async ({ threadId }) => {
        // Cancel any refetches
        queryClient.cancelQueries({
          queryKey,
        });

        // Snapshot the previous value
        const previousThreads = queryClient.getQueryData(queryKey);

        // Optimistically update the new value
        queryClient.setQueryData(queryKey, (oldThreads) => {
          const newThreads = produce(oldThreads!, (draftThreads) => {
            const page = draftThreads.pages.find(({ threads }) =>
              threads.some((thread) => thread.id === threadId)
            );
            if (!page) return;
            page.threads = page.threads.filter(
              (thread) => thread.id !== threadId
            );
          });
          return newThreads;
        });

        if (params.threadId === threadId) {
          router.push('/');
        }
        // Return snapshot value
        return { previousThreads };
      },
      // If the mutation failed, roll back to the previous value
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(queryKey, context?.previousThreads);
      },
    })
  );

  // Gonna create a target element at the bottom of the list to observe with IntersectionObserver
  const intersectionTargetRef = React.useRef<null | HTMLDivElement>(null);
  useIntersectionObserver(
    intersectionTargetRef,
    () => hasNextPage && fetchNextPage()
  );

  const pathname = usePathname();

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
          <SearchInput
            placeholder='Search your threads...'
            value={search ?? ''}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SidebarGroup>
        {(['Today', 'This week', 'More than a week ago'] as const).map(
          (accessorKey) => {
            const threads = mapDateCategoryToThreads?.[accessorKey];
            if (!threads || !threads.length) return null;
            return (
              <SidebarGroup key={accessorKey}>
                <SidebarGroupLabel>{accessorKey}</SidebarGroupLabel>
                <SidebarGroupContent className='relative'>
                  <SidebarMenu>
                    {mapDateCategoryToThreads?.[accessorKey].map((thread) => (
                      // TODO: Extract as custom component
                      <SidebarMenuItem
                        className={cn(
                          'hover:bg-sidebar-accent rounded-md',
                          pathname === `/threads/${thread.id}` &&
                            'bg-sidebar-accent'
                        )}
                        key={thread.id}
                      >
                        <SidebarMenuButton asChild>
                          <Link href={`/threads/${thread.id}`}>
                            <span>{thread.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        <div className='group-hover/menu-item:inline-flex items-center hidden absolute top-0 right-0 bottom-0 gap-2'>
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
                            <Button type='button' size='icon' variant='link'>
                              <X />
                            </Button>
                          </ConfirmationDialog>
                        </div>
                      </SidebarMenuItem>
                    ))}
                    {(isFetchingNextPage || isLoading) && (
                      <Loader2 className='size-5 animate-spin mx-auto' />
                    )}
                    <div
                      ref={intersectionTargetRef}
                      className='absolute bottom-20'
                    />
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }
        )}
        <SidebarGroup className='sticky bg-sidebar pb-4 bottom-0 mt-auto'>
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
