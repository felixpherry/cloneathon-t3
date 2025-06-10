'use client';

import { Code, GraduationCap, Telescope, WandSparkles } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

type QuickAction = {
  id: string;
  label: string;
};

const categories = [
  {
    label: 'Create',
    value: 'CREATE',
    icon: WandSparkles,
  },
  {
    label: 'Explore',
    value: 'EXPLORE',
    icon: Telescope,
  },
  {
    label: 'Code',
    value: 'CODE',
    icon: Code,
  },
  {
    label: 'Learn',
    value: 'LEARN',
    icon: GraduationCap,
  },
] as const;

type QuickActionsByCategory = {
  [category: string]: QuickAction[];
};

const defaultQuickActions: QuickAction[] = [
  { id: crypto.randomUUID(), label: 'How does AI work?' },
  { id: crypto.randomUUID(), label: 'Are black holes real?' },
  {
    id: crypto.randomUUID(),
    label: 'How many Rs are in the word "strawberry"?',
  },
  { id: crypto.randomUUID(), label: 'What is the meaning of life?' },
];

export const categoryToQuickActionsMap: QuickActionsByCategory = {
  CREATE: [
    { id: 'create-1', label: 'Design a modern landing page layout' },
    { id: 'create-2', label: 'Draft a compelling product summary' },
    { id: 'create-3', label: 'Generate an outline for a technical blog post' },
    { id: 'create-4', label: 'Compose a startup elevator pitch' },
  ],
  EXPLORE: [
    { id: 'explore-1', label: 'Summarize emerging frontend trends' },
    { id: 'explore-2', label: 'Identify top GitHub projects by category' },
    { id: 'explore-3', label: 'Compare modern JavaScript frameworks' },
    { id: 'explore-4', label: 'Analyze current frontend hiring patterns' },
  ],
  CODE: [
    { id: 'code-1', label: 'Refactor code for clarity and efficiency' },
    { id: 'code-2', label: 'Break down and explain a code snippet' },
    { id: 'code-3', label: 'Migrate JavaScript to TypeScript' },
    { id: 'code-4', label: 'Generate unit tests for a function' },
  ],
  LEARN: [
    { id: 'learn-1', label: 'Understand closures in JavaScript' },
    { id: 'learn-2', label: 'Distinguish between Remix and Next.js' },
    { id: 'learn-3', label: 'Learn accessibility fundamentals for UI' },
    { id: 'learn-4', label: 'Create a reusable custom React hook' },
  ],
};

export default function QuickActionsPanel() {
  const [selectedCategory, setSelectedCategory] = React.useState<null | string>(
    null
  );

  function handleSelectCategory(category: string) {
    setSelectedCategory(selectedCategory === category ? null : category);
  }

  const quickActions =
    selectedCategory === null
      ? defaultQuickActions
      : categoryToQuickActionsMap[selectedCategory];

  return (
    <div className='py-40 flex flex-col gap-8'>
      <h2 className='font-semibold text-3xl text-center lg:text-left'>
        How can I help you?
      </h2>
      <div className='flex items-center gap-2 justify-center lg:justify-start'>
        {categories.map(({ label, value, icon: Icon }) => (
          <Button
            key={value}
            onClick={() => handleSelectCategory(value)}
            variant={selectedCategory === value ? 'default' : 'outline'}
            className='rounded-full font-semibold'
          >
            <Icon />
            {label}
          </Button>
        ))}
      </div>
      <div className='flex flex-col items-stretch gap-y-2'>
        {quickActions.map(({ id, label }) => (
          <button
            key={id}
            className='text-muted-foreground text-start text-lg hover:bg-accent font-medium rounded-md p-2'
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
