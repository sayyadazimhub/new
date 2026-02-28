import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { purchaseService } from '@/services/userService/purchaseService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const purchase = await purchaseService.getPurchaseById(id);
    return NextResponse.json(purchase);
  } catch (err) {
    console.error('Purchase GET error:', err);
    if (err.message === 'Purchase not found') {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch purchase' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paidAmount } = body;

    const updated = await purchaseService.updatePayment(id, paidAmount);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Purchase PUT error:', err);
    const status = err.message === 'paidAmount is required' ? 400 : (err.message === 'Purchase not found' ? 404 : 500);
    return NextResponse.json({ error: err.message || 'Failed to update purchase' }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await purchaseService.deletePurchase(id, decoded.id);

    return NextResponse.json({ message: 'Purchase deleted successfully' });
  } catch (err) {
    console.error('Purchase DELETE error:', err);
    const status = err.message === 'Purchase not found' ? 404 : 500;
    return NextResponse.json({ error: err.message || 'Failed to delete purchase' }, { status });
  }
}
