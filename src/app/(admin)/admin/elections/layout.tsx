import { AuthProvider } from "@/lib/hooks/useAuth";

export default function ElectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}