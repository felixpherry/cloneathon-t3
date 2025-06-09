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

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href='/' className='mx-auto font-semibold text-xl font-mono'>
          T4.chat
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='gap-2'>
          <Button className='font-semibold' asChild>
            <Link href='/'>New Chat</Link>
          </Button>
          <div className='relative border-b-border border-b'>
            <Search className='absolute left-2 top-1/2 -translate-y-1/2 size-4.5' />
            <Input
              className='border-none focus-visible:border-none focus-visible:outline-none focus-visible:shadow-none pl-9.5'
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
