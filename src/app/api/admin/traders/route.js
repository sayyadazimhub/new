import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { traderService } from '@/services/adminService/traderService';

export async function GET(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        const data = await traderService.getTraders(search, page, limit);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Admin traders API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await request.json();

        const trader = await traderService.updateStatus(id, status);

        return NextResponse.json(trader);
    } catch (error) {
        console.error('Update trader error:', error);
        return NextResponse.json({ error: 'Failed to update trader' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await traderService.deleteTrader(id);

        return NextResponse.json({
            message: 'Trader account and all associated data deleted successfully'
        });
    } catch (error) {
        console.error('Delete trader error:', error);

        if (error.code === 'P2025' || error.message.includes('not found')) {
            return NextResponse.json({ error: 'Trader not found or already deleted' }, { status: 404 });
        }

        return NextResponse.json({
            error: error.message || 'Failed to delete trader'
        }, { status: 500 });
    }
}
