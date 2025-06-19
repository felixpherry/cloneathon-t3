import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export default function useModelData() {
  const trpc = useTRPC();

  const modelsQuery = useQuery(trpc.getModels.queryOptions());
  const favoriteModelsQuery = useQuery(trpc.getFavoriteModels.queryOptions());

  return {
    models: modelsQuery.data?.data ?? [],
    favoriteModelIds:
      favoriteModelsQuery.data?.map(({ modelId }) => modelId) ?? [],
    isLoading: modelsQuery.isLoading || favoriteModelsQuery.isLoading,
  };
}
