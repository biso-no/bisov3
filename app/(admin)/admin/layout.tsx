import '@/app/globals.css';
import { AdminLayout as Component } from '@/components/admin-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Component>
    {children}
    </Component>
  );
}