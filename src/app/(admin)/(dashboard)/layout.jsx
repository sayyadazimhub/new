import AdminHeader from '@/components/AdminHeader';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({ children }) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        redirect('/login');
    }

    const decoded = await verifyUserToken(token);
    if (!decoded) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row force-light bg-background">
            <div className="flex flex-col flex-1">
                <AdminHeader />
                <main className="flex-1 overflow-auto p-4 lg:p-6 bg-slate-50/30">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
