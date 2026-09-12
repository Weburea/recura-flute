import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

import type { Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SimulatorDetector } from "@/components/SimulatorDetector";
import { LanguageProvider } from "@/context/language-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <SimulatorDetector />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}