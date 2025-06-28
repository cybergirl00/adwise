import { AuthProvider } from '@/context/auth-context';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs'
import { OtpModal } from '@/components/auth/otpModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Adwise - Nigeria\'s Premier Ad Network',
  description: 'Connect developers, businesses, and creators through intelligent advertising solutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
         attribute="class"
            defaultTheme="dark"
            // enableSystem
            // disableTransitionOnChange
        >
        <AuthProvider>
          {children}
          <OtpModal />
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}