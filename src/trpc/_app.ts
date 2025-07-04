import { mergeRouters } from './init';
import authRouters from './routers/auth.routers';
import threadRouters from './routers/thread.routers';
import messageRouters from './routers/message.routers';
import modelRouters from './routers/model.routers';

export const appRouter = mergeRouters(
  authRouters,
  threadRouters,
  messageRouters,
  modelRouters
);

export type AppRouter = typeof appRouter;
