import '@/app/globals.css';
import { AdminLayout as Component } from '@/components/admin-layout';
import { getUserRoles } from '@/app/actions/admin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const roles = await getUserRoles()


  return (
    <Component roles={roles}>
    {children}
    </Component>
  );
}