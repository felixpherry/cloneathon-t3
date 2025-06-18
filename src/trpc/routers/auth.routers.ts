import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { baseProcedure, privateProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import prisma from '@/lib/prisma';

const authRouters = {
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
};

export default authRouters;
