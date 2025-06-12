import { z } from 'zod';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { baseProcedure, createTRPCRouter, privateProcedure } from './init';
import { TRPCError } from '@trpc/server';
import prisma from '@/lib/prisma';

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
  // todo: infinite query
  getThreads: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    return await prisma.thread.findMany({
      where: {
        userId: user.id,
      },
    });
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
