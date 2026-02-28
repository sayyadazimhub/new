import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { traderService } from '@/services/adminService/traderService';

export async function GET(request, { params }) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        const data = await traderService.getTraderDetail(id);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Admin trader detail API error:', error);
        if (error.message === 'Trader not found') {
            return NextResponse.json({ error: 'Trader not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
