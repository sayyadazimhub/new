import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { dashboardService } from '@/services/userService/dashboardService';

export async function GET(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const data = await dashboardService.getDashboardData(decoded.id, startDateParam, endDateParam);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Dashboard GET:', err);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
