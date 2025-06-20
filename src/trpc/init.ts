import superjson from 'superjson';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import React from 'react';

export const createTRPCContext = React.cache(async () => {
  return {};
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;
export const baseProcedure = t.procedure;
export const privateProcedure = t.procedure.use(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({ ctx: { user } });
});
