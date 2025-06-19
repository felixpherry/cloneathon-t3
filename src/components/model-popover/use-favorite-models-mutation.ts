import { useTRPC } from '@/trpc/client';
import { createId } from '@paralleldrive/cuid2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export default function useFavoriteModelsMutation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const favoriteModelsQueryKey = trpc.getFavoriteModels.queryKey();
  return useMutation(
    trpc.toggleFavoriteModel.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: favoriteModelsQueryKey,
        });
      },
      onMutate: ({ modelId }) => {
        // 1. Cancel any ongoing queries.
        queryClient.cancelQueries({
          queryKey: favoriteModelsQueryKey,
        });

        // 2. Snapshot previous cache
        const oldModels = queryClient.getQueryData(favoriteModelsQueryKey);

        // 3. Update the cache
        queryClient.setQueryData(
          favoriteModelsQueryKey,
          (oldFavoriteModels) => {
            const newModels = produce(
              oldFavoriteModels,
              (draftFavoriteModels) => {
                const modelIdx = draftFavoriteModels?.findIndex(
                  (model) => model.modelId === modelId
                );
                // Got a bug regarding 0. 0 is falsy so if we only have 1 item, the optimistic update doesn't run.
                if (typeof modelIdx !== 'undefined' && modelIdx !== -1) {
                  draftFavoriteModels?.splice(modelIdx, 1);
                } else {
                  const mockFavoriteModelId = createId();
                  draftFavoriteModels?.unshift({
                    createdAt: new Date(),
                    modelId,
                    userId: '',
                    id: mockFavoriteModelId,
                    updatedAt: new Date(),
                  });
                }
              }
            );
            return newModels;
          }
        );

        return {
          oldModels,
        };
      },
      onError: (error, newModel, context) => {
        // Rollback when there's error
        queryClient.setQueryData(favoriteModelsQueryKey, context?.oldModels);
      },
    })
  );
}
