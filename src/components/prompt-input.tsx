'use client';

import React from 'react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { ArrowUp, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import { usePromptInput } from './prompt-input-provider';

type Props = React.ComponentProps<'form'>;
export default function PromptInput({ className, ...props }: Props) {
  const { prompt, setPrompt } = usePromptInput();
  const promptInputRef = React.useRef<null | HTMLInputElement>(null);
  React.useEffect(() => {
    if (!!prompt) {
      promptInputRef.current?.focus();
    }
  }, [prompt]);

  React.useEffect(() => {
    promptInputRef.current?.focus();
  }, []);

  return (
    <form
      className={cn(className, 'bg-sidebar p-2 pb-0 rounded-t-2xl shadow-sm')}
      {...props}
    >
      <div className='bg-white p-2 rounded-t-xl flex flex-col gap-8 shadow-sm'>
        <Input
          ref={promptInputRef}
          className='border-none focus-visible:ring-0 md:text-md'
          placeholder='Type your message here...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className='flex items-center gap-2 px-2'>
          <Button className='rounded-full' size='icon' variant='outline'>
            <Paperclip className='size-4' />
          </Button>
          <Button className='ml-auto' size='icon'>
            <ArrowUp />
          </Button>
        </div>
      </div>
    </form>
  );
}
