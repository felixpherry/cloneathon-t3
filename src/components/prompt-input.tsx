'use client';

import React from 'react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { ArrowUp, Paperclip } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  className: string;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<null | HTMLInputElement>;
  handleSubmit: () => void;
}

export default function PromptInput({
  prompt,
  setPrompt,
  className,
  handleSubmit,
  inputRef,
}: Props) {
  React.useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!prompt) return;
        handleSubmit();
      }}
      className={cn(className, 'bg-sidebar p-2 pb-0 rounded-t-2xl shadow-sm')}
    >
      <div className='bg-white p-2 rounded-t-xl flex flex-col gap-8 shadow-sm'>
        <Input
          ref={inputRef}
          className='border-none focus-visible:ring-0 md:text-md'
          placeholder='Type your message here...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className='flex items-center gap-2 px-2'>
          <Button className='rounded-full' size='icon' variant='outline'>
            <Paperclip className='size-4' />
          </Button>
          <Button disabled={!prompt} className='ml-auto' size='icon'>
            <ArrowUp />
          </Button>
        </div>
      </div>
    </form>
  );
}
