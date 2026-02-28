import { NextResponse } from 'next/server';
import { customerService } from '@/services/userService/customerService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const customer = await customerService.getCustomerById(id);
    return NextResponse.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    if (err.message === 'Customer not found') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const customer = await customerService.updateCustomer(id, body);
    return NextResponse.json(customer);
  } catch (err) {
    console.error('Update customer error:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await customerService.deleteCustomer(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete customer error:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
