import React from 'react';

type State =
  | {
      prompt: string;
      setPrompt: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined;

const PromptInputContext = React.createContext<State>(undefined);

export default function PromptInputProvider({
  children,
}: React.PropsWithChildren) {
  const [prompt, setPrompt] = React.useState('');

  const value = React.useMemo(
    () => ({
      prompt,
      setPrompt,
    }),
    [prompt]
  );

  return <PromptInputContext value={value}>{children}</PromptInputContext>;
}

export function usePromptInput() {
  const context = React.use(PromptInputContext);
  if (typeof context === 'undefined') {
    throw new Error('usePromptInput must be used within PromptInputProvider');
  }
  return context;
}
