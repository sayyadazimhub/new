import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata = {
  title: 'ATMS - Agricultural Trading Management System',
  description: 'Manage inventory, sales, purchases, and reports for your agricultural trading business.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
