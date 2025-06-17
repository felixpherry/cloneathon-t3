'use client';

import PromptInput from '@/components/prompt-input';
import UserBubbleChat from '@/components/user-bubble-chat';
import useIntersectionObserver from '@/hooks/use-intersection-observer';
import { useTRPC } from '@/trpc/client';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { produce } from 'immer';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

export default function Page() {
  const trpc = useTRPC();
  const params = useParams();
  const threadId = params.threadId as string;
  const {
    data: messagesResponse,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.infiniteMessages.infiniteQueryOptions(
      {
        threadId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      }
    )
  );

  const flattenMessages = messagesResponse?.pages.flatMap(
    ({ messages }) => messages
  );
  const inputRef = React.useRef<null | HTMLInputElement>(null);
  const [prompt, setPrompt] = React.useState('');
  const queryClient = useQueryClient();
  const queryKey = trpc.infiniteMessages.infiniteQueryKey({ threadId });
  const { mutate: sendMessage } = useMutation(
    trpc.sendMessage.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey,
        });
        scrollChatToBottom();
      },
      onMutate: ({ content, threadId }) => {
        // 1. Stop ongoing refetches
        queryClient.cancelQueries({ queryKey });

        // 2. Snapshot previous values
        const prevMessages = queryClient.getQueryData(queryKey);

        // 3. Optimistic update
        queryClient.setQueryData(queryKey, (oldMessages) => {
          const mockMessageId = crypto.randomUUID();
          const newMessages = produce(oldMessages, (draftMessages) => {
            // Mock the optimistic data
            draftMessages?.pages.unshift({
              messages: [
                {
                  id: mockMessageId,
                  content,
                  attachmentUrl: null,
                  createdAt: new Date(),
                  threadId,
                  updatedAt: new Date(),
                  userId: '',
                },
              ],
              nextCursor: null,
            });
          });
          return newMessages;
        });
        return { prevMessages };
      },
      onError: (error, newMessage, context) => {
        queryClient.setQueryData(queryKey, context?.prevMessages);
      },
    })
  );
  function handleSubmit() {
    sendMessage({ content: prompt, threadId });
    setPrompt('');
  }

  const intersectionTargetRef = React.useRef<HTMLDivElement | null>(null);
  useIntersectionObserver(
    intersectionTargetRef,
    () => hasNextPage && fetchNextPage()
  );

  // Target to scroll chat to bottom.
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  function scrollChatToBottom() {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  React.useEffect(() => {
    // isLoading to indicate the first time we fetch the data.
    if (!isLoading) {
      scrollChatToBottom();
    }
  }, [isLoading]);

  return (
    <>
      <div className='mb-auto flex flex-col-reverse gap-12 py-15 relative'>
        {flattenMessages?.map((message) => (
          <UserBubbleChat
            className='ml-auto'
            key={message.id}
            text={message.content}
          />
        ))}
        <div ref={intersectionTargetRef} className='absolute top-20' />
        {(isLoading || isFetchingNextPage) && (
          <Loader2 className='size-5 animate-spin mx-auto' />
        )}
      </div>
      {/* Anchor div to scroll to bottom */}
      <div ref={bottomRef} />

      <PromptInput
        inputRef={inputRef}
        prompt={prompt}
        setPrompt={setPrompt}
        className='sticky bottom-0 w-full'
        handleSubmit={handleSubmit}
      />
    </>
  );
}
