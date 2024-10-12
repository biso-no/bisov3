import { GoogleAnalytics } from '@next/third-parties/google'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const tagId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  return (
    <>
      {children}
      <GoogleAnalytics gaId={tagId} />
    </>
  );
}