import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { reportService } from '@/services/adminService/reportService';

export async function GET(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '30d';

        const data = await reportService.getAdminReports(range);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Admin Reports API Error:', error);
        return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
    }
}
