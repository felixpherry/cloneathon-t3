'use client';

import PromptInput from '@/components/prompt-input';
import QuickPromptsPanel from '@/components/quick-prompts-panel';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createId } from '@paralleldrive/cuid2';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [prompt, setPrompt] = React.useState('');
  const inputRef = React.useRef<null | HTMLInputElement>(null);

  function setPromptAndFocus(newPrompt: string) {
    setPrompt(newPrompt);
    inputRef.current?.focus();
  }

  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const { mutate: sendMessage } = useMutation(
    trpc.sendMessage.mutationOptions({
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.infiniteThreads.infiniteQueryKey(),
        }),
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
