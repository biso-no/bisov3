import '@/app/globals.css';
import { AdminLayout as Component } from '@/components/admin-layout';
import { getUserRoles } from '@/app/actions/admin';
import { getLoggedInUser } from '@/lib/actions/user';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const roles = await getUserRoles()
  const user = await getLoggedInUser()


  return (
    <Component roles={roles} firstName={user?.user.name.split(' ')[0]}>
    {children}
    </Component>
  );
}