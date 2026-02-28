import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { reportService } from '@/services/userService/reportService';

export async function GET(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const options = {
      type: searchParams.get('type') || 'today',
      start: searchParams.get('start'),
      end: searchParams.get('end')
    };

    const data = await reportService.getUserReports(decoded.id, options);

    return NextResponse.json(data);
  } catch (err) {
    console.error('User Reports GET error:', err);
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 });
  }
}
