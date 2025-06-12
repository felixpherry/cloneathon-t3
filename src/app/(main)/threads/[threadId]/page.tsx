import prisma from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const messages = await prisma.message.findMany({
    where: {
      userId: user?.id,
      threadId,
    },
  });
  return <div className='mb-auto'>{JSON.stringify(messages)}</div>;
}
