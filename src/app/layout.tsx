import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { AppProviders } from "@/shared/providers/AppProviders";
import { Toaster } from "@/shared/components/ui/sonner";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { GlobalErrorHandler } from "@/shared/components/GlobalErrorHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Click ERP - Enterprise Management Suite",
  description: "Modern ERP application for enterprise management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <GlobalErrorHandler />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProviders>
              <QueryProvider>{children}</QueryProvider>
              <Toaster />
            </AppProviders>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
