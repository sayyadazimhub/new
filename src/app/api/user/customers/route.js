import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { customerService } from '@/services/userService/customerService';

export async function GET(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search') || '';

    const data = await customerService.getCustomers(decoded.id, search, page, limit);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Customers GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const customer = await customerService.createCustomer(decoded.id, body);

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    console.error('Customers POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create customer' }, { status: err.message === 'Name is required' ? 400 : 500 });
  }
}
