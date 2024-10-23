import { SignOutButton } from "@/components/sign-out-button";

export default function ElectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-end p-4">
        <SignOutButton />
      </div>
      {children}
    </div>
  );
}