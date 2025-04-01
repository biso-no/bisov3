import "./styles.css";
import { museoSans } from './fonts';
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
    <html lang="en" className={`${museoSans.variable}`}>
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