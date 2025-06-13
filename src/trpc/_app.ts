import { z } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { baseProcedure, createTRPCRouter, privateProcedure } from './init';
import { TRPCError } from '@trpc/server';
import prisma from '@/lib/prisma';

// TODO: Refactor routers into separate files
export const appRouter = createTRPCRouter({
  authCallback: baseProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (dbUser) {
      return { user: dbUser };
    }

    return await prisma.user.create({
      data: {
        id: user.id,
        name: `${user.given_name ?? ''} ${user.family_name ?? ''}`.trim(),
        email: user.email,
        imageUrl: user.picture,
      },
    });
  }),
  getUser: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    return dbUser;
  }),
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
});

export type AppRouter = typeof appRouter;
