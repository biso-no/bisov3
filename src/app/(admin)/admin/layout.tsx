import '@/app/globals.css';
import { AdminLayout as Component } from '@/components/admin-layout';
import { getUserRoles } from '@/app/actions/admin';
import { getLoggedInUser } from '@/lib/actions/user';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const roles = await getUserRoles()
  
  const user = await getLoggedInUser()
  console.log("User object:", user)
  
  // Add fallback for when name is undefined
  const firstName = user && user.user.name ? user.user.name.split(' ')[0] : 'User'

  return (
    <Component roles={roles} firstName={firstName}>
    {children}
    </Component>
  );
}