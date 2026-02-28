import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { dashboardService } from '@/services/adminService/dashboardService';

export async function GET() {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyUserToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Service handles stats, chart data, and recent traders
        const data = await dashboardService.getDashboardData();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Admin dashboard API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
