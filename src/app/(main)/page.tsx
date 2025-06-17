'use client';

import PromptInput from '@/components/prompt-input';
import QuickPromptsPanel from '@/components/quick-prompts-panel';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createId } from '@paralleldrive/cuid2';
import React from 'react';
import { useRouter } from 'next/navigation';
import { produce } from 'immer';

export default function Home() {
  const [prompt, setPrompt] = React.useState('');
  const inputRef = React.useRef<null | HTMLInputElement>(null);

  function setPromptAndFocus(newPrompt: string) {
    setPrompt(newPrompt);
    inputRef.current?.focus();
  }

  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const threadsQuerykey = trpc.infiniteThreads.infiniteQueryKey({});

  // There're 2 optimistic updates here:
  // 1. Optimistic update the threads
  // 2. Optimistic update the messages inside the thread.
  const { mutate: sendMessage } = useMutation(
    trpc.sendMessage.mutationOptions({
      onSettled: (newThread) => {
        const messagesQueryKey = trpc.infiniteMessages.infiniteQueryKey({
          threadId: newThread?.id,
        });
        queryClient.invalidateQueries({
          queryKey: threadsQuerykey,
        });
        queryClient.invalidateQueries({
          queryKey: messagesQueryKey,
        });
      },
      onMutate: ({ threadId, content }) => {
        const messagesQuerykey = trpc.infiniteMessages.infiniteQueryKey({
          threadId,
        });
        // Threads
        // 1. Stop ongoing refetches
        queryClient.cancelQueries({ queryKey: threadsQuerykey });

        // 2. Snapshot previous threads
        const previousThreads = queryClient.getQueryData(threadsQuerykey);

        // Optimistically update the new value
        queryClient.setQueryData(threadsQuerykey, (oldThreads) => {
          const newThreads = produce(oldThreads!, (draftThreads) => {
            // Mock the optimistic data.
            draftThreads.pages.unshift({
              nextCursor: null,
              threads: [
                {
                  createdAt: new Date(),
                  id: threadId,
                  title: 'New Thread',
                  updatedAt: new Date(),
                  userId: '',
                },
              ],
            });
          });
          return newThreads;
        });

        queryClient.setQueryData(messagesQuerykey, () => {
          const mockMessageId = crypto.randomUUID();
          return {
            pages: [
              {
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
              },
            ],
            pageParams: [],
          };
        });
        return {
          previousThreads,
        };
      },
      onError: (err, newMessage, context) => {
        queryClient.setQueryData(threadsQuerykey, context?.previousThreads);
      },
    })
  );

  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit() {
    const threadId = createId();
    sendMessage({
      threadId,
      content: prompt,
    });
    startTransition(() => {
      router.push(`/threads/${threadId}`);
    });
    setPrompt('');
  }

  return (
    <>
      <QuickPromptsPanel
        setPrompt={setPromptAndFocus}
        isVisible={!prompt && !isPending}
      />
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
