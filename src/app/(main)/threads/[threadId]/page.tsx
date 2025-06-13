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
  const { mutate: sendMessage } = useMutation(
    trpc.sendMessage.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.infiniteMessages.infiniteQueryKey({ threadId }),
        });
        scrollChatToBottom();
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
