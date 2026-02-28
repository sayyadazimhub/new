import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { providerService } from '@/services/userService/providerService';

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

    const data = await providerService.getProviders(decoded.id, search, page, limit);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Providers GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const provider = await providerService.createProvider(decoded.id, body);

    return NextResponse.json(provider, { status: 201 });
  } catch (err) {
    console.error('Providers POST error:', err);
    const status = err.message === 'Name is required' ? 400 : 500;
    return NextResponse.json({ error: err.message || 'Failed to create provider' }, { status });
  }
}
