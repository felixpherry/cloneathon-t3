import { Button } from '@/components/ui/button';
import { Code, GraduationCap, Telescope, WandSparkles } from 'lucide-react';

const messages = [
  'How does AI work?',
  'Are black holes real?',
  'How many Rs are in the word "strawberry"?',
  'What is the meaning of life?',
];

export default function Home() {
  return (
    <div className='py-40 flex flex-col gap-8'>
      <h2 className='font-semibold text-3xl text-center lg:text-left'>
        How can I help you?
      </h2>
      <div className='flex items-center gap-2 justify-center lg:justify-start'>
        <Button variant='outline' className='rounded-full'>
          <WandSparkles />
          Create
        </Button>
        <Button variant='outline' className='rounded-full'>
          <Telescope />
          Explore
        </Button>
        <Button variant='outline' className='rounded-full'>
          <Code />
          Code
        </Button>
        <Button variant='outline' className='rounded-full'>
          <GraduationCap />
          Learn
        </Button>
      </div>
      <div className='flex flex-col items-stretch gap-y-2'>
        {messages.map((message) => (
          <button
            key={message}
            className='text-muted-foreground text-start text-lg hover:bg-accent font-medium rounded-md p-2'
          >
            {message}
          </button>
        ))}
      </div>
    </div>
  );
}
