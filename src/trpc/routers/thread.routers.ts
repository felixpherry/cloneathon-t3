import { z } from 'zod';
import { privateProcedure } from '../init';
import prisma from '@/lib/prisma';

const threadRouters = {
  infiniteThreads: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).default(30),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { cursor, limit, search } = input;
      const threads = await prisma.thread.findMany({
        where: {
          userId: user.id,
          title: {
            contains: search,
          },
        },
        take: limit + 1,
        cursor: cursor
          ? {
              id_createdAt: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (threads.length > limit) {
        const nextThread = threads.pop();
        nextCursor = {
          id: nextThread!.id,
          createdAt: nextThread!.createdAt,
        };
      }

      return {
        threads,
        nextCursor,
      };
    }),
  deleteThread: privateProcedure
    .input(
      z.object({
        threadId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { threadId } = input;
      return await prisma.thread.delete({
        where: {
          id: threadId,
          userId: user.id,
        },
      });
    }),
};

export default threadRouters;
