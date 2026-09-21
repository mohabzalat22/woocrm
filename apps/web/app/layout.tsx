import localFont from "next/font/local";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/common/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html
        lang="en"
        className={cn("font-mono", jetbrainsMono.variable)}
        suppressHydrationWarning
      >
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </QueryProvider>
  );
}
