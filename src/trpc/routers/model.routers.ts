import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '../init';
import prisma from '@/lib/prisma';

type Modality = 'text' | 'image' | 'file';
export interface Model {
  id: string;
  name: string;
  created: number;
  description: string;
  architecture: {
    input_modalities: Modality[];
    output_modalities: Modality[];
    tokenizer: string;
  };
  top_provider: {
    is_moderated: boolean;
  };
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
    input_cache_read: string;
    input_cache_write: string;
    web_search: string;
    internal_reasoning: string;
  };
  context_length: number;
  hugging_face_id: string;
  per_request_limits: {
    key: string;
  };
  supported_parameters: string[];
}

interface ModelResponse {
  data: Model[];
}

const modelRouters = createTRPCRouter({
  getModels: privateProcedure.query(async () => {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const models = (await response.json()) as ModelResponse;
    return models;
  }),
  getFavoriteModels: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const favoriteModels = await prisma.favoriteModel.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return favoriteModels;
  }),
  toggleFavoriteModel: privateProcedure
    .input(
      z.object({
        modelId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { modelId } = input;
      const count = await prisma.favoriteModel.count({
        where: {
          userId: user.id,
          modelId,
        },
      });
      const isFavorite = count > 0;
      if (isFavorite) {
        await prisma.favoriteModel.deleteMany({
          where: {
            userId: user.id,
            modelId,
          },
        });
      } else {
        await prisma.favoriteModel.create({
          data: {
            modelId,
            userId: user.id,
          },
        });
      }
    }),
});

export default modelRouters;
