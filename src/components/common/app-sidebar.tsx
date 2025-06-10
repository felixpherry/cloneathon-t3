import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { requireUserId } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default async function AppSidebar() {
  const user = await requireUserId();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href='/' className='mx-auto font-semibold text-xl font-mono'>
          T4.chat
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='gap-2 top-0'>
          <Button className='font-semibold' asChild>
            <Link href='/'>New Chat</Link>
          </Button>
          <div className='relative border-b-border border-b'>
            <Search className='absolute left-2 top-1/2 -translate-y-1/2 size-4.5' />
            <Input
              className='border-none focus-visible:ring-0 pl-9.5'
              placeholder='Search your threads...'
            />
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Today</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className='sticky bg-sidebar bottom-4 mt-auto'>
          <Link
            href='/settings/subscription'
            className='flex items-center gap-4 hover:bg-white p-2 hover:shadow-xs rounded'
          >
            <Avatar className='size-8.5'>
              <AvatarImage
                src={user.picture || '/images/avatar-fallback.png'}
              />
              <AvatarFallback>{user.given_name}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col text-start gap-1'>
              <p className='text-sm font-semibold'>
                {user.given_name} {user.family_name}
              </p>
              <p className='text-muted-foreground text-xs'>Free</p>
            </div>
          </Link>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
  },
  {
    title: 'Inbox',
    url: '#',
  },
  {
    title: 'Calendar',
    url: '#',
  },
  {
    title: 'Search',
    url: '#',
  },
  {
    title: 'Settings',
    url: '#',
  },
];
