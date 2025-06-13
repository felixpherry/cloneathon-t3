'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface Props extends React.ComponentProps<'div'> {
  text: string;
}
export default function UserBubbleChat({ text, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn('rounded-lg p-4 bg-primary-foreground', className)}
    >
      <p>{text}</p>
    </div>
  );
}
