"use client"

import "./styles.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {AppContextProvider} from "./contexts"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppContextProvider>
      <body>
        {children}
        </body>

      </AppContextProvider>

    </html>
  );
}

export const dynamic = 'force-dynamic';