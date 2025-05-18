import type { Metadata } from "next";
import clsx from "clsx";
import { Archivo } from "next/font/google";
import "./globals.css";


const archivo = Archivo({
    display: "swap",
    weight: "variable",
    subsets: ["latin"],
    variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Created by amaltechworld",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body
              suppressHydrationWarning
              className={clsx(
                  archivo.className,
                  "font-sans antialiased bg-stone-200 text-stone-900 "
              )}
          >
              {children}
          </body>
      </html>
  );
}

