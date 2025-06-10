import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export async function requireUserId() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect('/auth-callback');
  return user;
}
