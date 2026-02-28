import { NextResponse } from 'next/server';
import { productService } from '@/services/userService/productService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await productService.getProductById(id);
    return NextResponse.json(product);
  } catch (err) {
    console.error('Fetch product error:', err);
    if (err.message === 'Product not found') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await productService.updateProduct(id, body);
    return NextResponse.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    const status = err.message.includes('Invalid') ? 400 : 500;
    return NextResponse.json({ error: err.message || 'Failed to update' }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await productService.deleteProduct(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
