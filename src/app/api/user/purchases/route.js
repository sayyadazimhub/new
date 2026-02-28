import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { purchaseService } from '@/services/userService/purchaseService';

export async function GET(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    const data = await purchaseService.getPurchases(decoded.id, page);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Purchases GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const purchase = await purchaseService.createPurchase(decoded.id, body);

    return NextResponse.json(purchase, { status: 201 });
  } catch (err) {
    console.error('Purchases POST error:', err);
    const status = err.message.includes('required') ? 400 : 500;
    return NextResponse.json({ error: err.message || 'Failed to create purchase' }, { status });
  }
}
