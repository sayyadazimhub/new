import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { saleService } from '@/services/userService/saleService';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const sale = await saleService.getSaleById(id);
        return NextResponse.json(sale);
    } catch (err) {
        console.error('Sale GET error:', err);
        if (err.message === 'Sale not found') {
            return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { paidAmount } = body;

        const updated = await saleService.updatePayment(id, paidAmount);

        return NextResponse.json(updated);
    } catch (err) {
        console.error('Sale PUT error:', err);
        const status = err.message === 'paidAmount is required' ? 400 : (err.message === 'Sale not found' ? 404 : 500);
        return NextResponse.json({ error: err.message || 'Failed to update sale' }, { status });
    }
}

export async function DELETE(request, { params }) {
    try {
        const token = (await cookies()).get('user-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        await saleService.deleteSale(id, decoded.id);

        return NextResponse.json({ message: 'Sale deleted successfully' });
    } catch (err) {
        console.error('Sale DELETE error:', err);
        const status = err.message === 'Sale not found' ? 404 : 500;
        return NextResponse.json({ error: err.message || 'Failed to delete sale' }, { status });
    }
}
