import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function UserDashboardLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('user-token')?.value;

  if (!token) {
    redirect('/user/login');
  }

  const decoded = await verifyUserToken(token);
  if (!decoded) {
    redirect('/user/login');
  }

  // CRITICAL: Verify user existence in DB (Server Side)
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, is_active: true }
  });

  if (!user || !user.is_active) {
    console.warn(`Access denied: User ${decoded.id} not found or inactive.`);
    redirect('/user/login');
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
