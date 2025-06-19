import { useTRPC } from '@/trpc/client';
import { Model } from '@/trpc/routers/model.routers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface State {
  model?: Model;
  setModel: (model: Model) => void;
}
const ModelContext = React.createContext<undefined | State>(undefined);

export function ModelProvider({ children }: React.PropsWithChildren) {
  const [model, setModel] = React.useState<Model | undefined>();
  const trpc = useTRPC();
  const { data: modelsResponse } = useQuery(trpc.getModels.queryOptions());

  React.useEffect(() => {
    // TODO: Preserve selected model in localstorage
    const firstFreeModel = modelsResponse?.data.find((model) =>
      model.id.endsWith(':free')
    );
    setModel(firstFreeModel);
  }, [modelsResponse]);

  const value = React.useMemo(
    () => ({
      model,
      setModel,
    }),
    [model]
  );
  return <ModelContext value={value}>{children}</ModelContext>;
}

export function useModel() {
  const context = React.use(ModelContext);
  if (typeof context === 'undefined') {
    throw new Error('useModel must be used within ModelProvider');
  }
  return context;
}
