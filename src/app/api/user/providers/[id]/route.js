import { NextResponse } from 'next/server';
import { providerService } from '@/services/userService/providerService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const provider = await providerService.getProviderById(id);
    return NextResponse.json(provider);
  } catch (err) {
    console.error('Error fetching provider:', err);
    if (err.message === 'Provider not found') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const provider = await providerService.updateProvider(id, body);
    return NextResponse.json(provider);
  } catch (err) {
    console.error('Update provider error:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await providerService.deleteProvider(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete provider error:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
