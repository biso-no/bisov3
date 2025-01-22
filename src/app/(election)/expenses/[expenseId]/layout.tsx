"use client"

import { FormContextProvider } from "./formContext";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <FormContextProvider>
      <body>
        {children}
        </body>

      </FormContextProvider>

    </html>
  );
}
