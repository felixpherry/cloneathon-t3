import { cn } from '@/lib/utils';
import React from 'react';

interface Props extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

export default function MaxWidthWrapper({
  children,
  className,
  ...props
}: Props) {
  return (
    <div {...props} className={cn('max-w-[800px] mx-auto', className)}>
      {children}
    </div>
  );
}
