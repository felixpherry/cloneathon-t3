import { LucideIcon, Search } from 'lucide-react';
import React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface Props extends React.ComponentProps<typeof Input> {
  icon?: LucideIcon;
}
export default function SearchInput({
  icon: Icon = Search,
  className,
  ...props
}: Props) {
  return (
    <label className='flex items-center gap-2 border-b border-b-border h-9 py-1'>
      <Icon className='size-4 text-muted-foreground' />
      <Input
        {...props}
        className={cn('border-none focus-visible:ring-0 px-0', className)}
      />

      <div className='sr-only'>Search</div>
    </label>
  );
}
