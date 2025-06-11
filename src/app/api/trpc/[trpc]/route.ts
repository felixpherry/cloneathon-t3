// import { appRouter } from '@/trpc/_app';
// import { createTRPCContext } from '@/trpc/init';
// import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// const handler = (req: Request) =>
//   fetchRequestHandler({
//     endpoint: '/api/trpc',
//     req,
//     router: appRouter,
//     createContext: createTRPCContext,
//   });

// export { handler as GET, handler as POST };

import { appRouter } from '@/trpc/_app';
import { createTRPCContext } from '@/trpc/init';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
}
export { handler as GET, handler as POST };
