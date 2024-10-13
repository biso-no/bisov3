import '@/app/globals.css';

export default function ElectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        {children}
    </div>
  )
}