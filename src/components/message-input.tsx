'use client';

import React from 'react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { ArrowUp, Paperclip } from 'lucide-react';
import { Button } from './ui/button';

type Props = React.ComponentProps<'div'>;
export default function MessageInput({ className, ...props }: Props) {
  return (
    <div
      className={cn(className, 'bg-sidebar p-2 pb-0 rounded-t-2xl shadow-sm')}
      {...props}
    >
      <div className='bg-white p-2 rounded-t-xl flex flex-col gap-8 shadow-sm'>
        <Input
          className='border-none focus-visible:ring-0 md:text-md'
          placeholder='Type your message here...'
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
    </div>
  );
}
