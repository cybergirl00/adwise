import { AuthProvider } from '@/context/auth-context';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
         attribute="class"
            defaultTheme="dark"
            // enableSystem
            // disableTransitionOnChange
        >
        <AuthProvider>
          {children}
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}