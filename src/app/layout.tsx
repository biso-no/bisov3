import "./styles.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Providers from "./providers"
import '@/app/globals.css';

export const metadata = {
  title: 'BI Student Organisation',
  description: 'BISO Apps',
};


import {AppContextProvider} from "./contexts"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
      <AppContextProvider>
      <body>
        {children}
        </body>

      </AppContextProvider>
      </Providers>
    </html>
  );
}

export const dynamic = 'force-dynamic';