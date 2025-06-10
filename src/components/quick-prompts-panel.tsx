'use client';

import { Code, GraduationCap, Telescope, WandSparkles } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { usePromptInput } from './prompt-input-provider';
import { AnimatePresence, motion } from 'motion/react';

type QuickPrompt = {
  id: string;
  value: string;
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

type QuickPromptsByCategory = {
  [category: string]: QuickPrompt[];
};

const defaultQuickPrompts: QuickPrompt[] = [
  { id: crypto.randomUUID(), value: 'How does AI work?' },
  { id: crypto.randomUUID(), value: 'Are black holes real?' },
  {
    id: crypto.randomUUID(),
    value: 'How many Rs are in the word "strawberry"?',
  },
  { id: crypto.randomUUID(), value: 'What is the meaning of life?' },
];

export const categoryToQuickPromptsMap: QuickPromptsByCategory = {
  CREATE: [
    { id: 'create-1', value: 'Design a modern landing page layout' },
    { id: 'create-2', value: 'Draft a compelling product summary' },
    { id: 'create-3', value: 'Generate an outline for a technical blog post' },
    { id: 'create-4', value: 'Compose a startup elevator pitch' },
  ],
  EXPLORE: [
    { id: 'explore-1', value: 'Summarize emerging frontend trends' },
    { id: 'explore-2', value: 'Identify top GitHub projects by category' },
    { id: 'explore-3', value: 'Compare modern JavaScript frameworks' },
    { id: 'explore-4', value: 'Analyze current frontend hiring patterns' },
  ],
  CODE: [
    { id: 'code-1', value: 'Refactor code for clarity and efficiency' },
    { id: 'code-2', value: 'Break down and explain a code snippet' },
    { id: 'code-3', value: 'Migrate JavaScript to TypeScript' },
    { id: 'code-4', value: 'Generate unit tests for a function' },
  ],
  LEARN: [
    { id: 'learn-1', value: 'Understand closures in JavaScript' },
    { id: 'learn-2', value: 'Distinguish between Remix and Next.js' },
    { id: 'learn-3', value: 'Learn accessibility fundamentals for UI' },
    { id: 'learn-4', value: 'Create a reusable custom React hook' },
  ],
};

export default function QuickPromptsPanel() {
  const [selectedCategory, setSelectedCategory] = React.useState<null | string>(
    null
  );

  function handleSelectCategory(category: string) {
    setSelectedCategory(selectedCategory === category ? null : category);
  }

  const quickPrompts =
    selectedCategory === null
      ? defaultQuickPrompts
      : categoryToQuickPromptsMap[selectedCategory];

  const { prompt, setPrompt } = usePromptInput();

  return (
    <AnimatePresence>
      {!prompt ? (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          className='py-40 flex flex-col gap-8'
        >
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
            {quickPrompts.map(({ id, value }) => (
              <button
                key={id}
                className='text-muted-foreground text-start text-lg hover:bg-accent font-medium rounded-md p-2'
                onClick={() => setPrompt(`${value} `)}
              >
                {value}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
