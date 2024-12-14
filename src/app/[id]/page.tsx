import { db } from '@/server/db';
import UserProfile from '@/app/components/layouts/UserProfile';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, params.id)
  });

  return <UserProfile user={user} />;
}