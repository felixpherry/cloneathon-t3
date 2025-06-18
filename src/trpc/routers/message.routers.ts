import prisma from '@/lib/prisma';
import { privateProcedure } from '../init';
import { z } from 'zod';

const messageRouters = {
  infiniteMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().default(15),
        threadId: z.string(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { limit, threadId, cursor } = input;
      const messages = await prisma.message.findMany({
        where: {
          userId: user.id,
          threadId,
        },
        cursor: cursor
          ? {
              id_createdAt: cursor,
            }
          : undefined,
        take: limit + 1,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined;
      if (messages.length > limit) {
        const nextMessage = messages.pop();
        nextCursor = {
          id: nextMessage!.id,
          createdAt: nextMessage!.createdAt,
        };
      }
      return {
        messages,
        nextCursor,
      };
    }),
  sendMessage: privateProcedure
    .input(
      z.object({
        content: z.string(),
        threadId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      const { content, threadId } = input;
      const thread = await prisma.thread.findUnique({
        where: {
          id: threadId,
        },
      });

      if (!thread) {
        return await prisma.thread.create({
          data: {
            id: threadId,
            userId: user.id,
            title: 'New Thread',
            messages: {
              create: {
                content,
                userId: user.id,
              },
            },
          },
        });
      }

      return await prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          messages: {
            create: {
              content,
              userId: user.id,
            },
          },
        },
      });
    }),
};

export default messageRouters;
