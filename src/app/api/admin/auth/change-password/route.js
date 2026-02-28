import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { authService } from '@/services/adminService/authService';

export async function POST(request) {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new password are required' },
        { status: 400 }
      );
    }

    await authService.changePassword(decoded.id, currentPassword, newPassword);

    return NextResponse.json({ message: 'Password updated' }, { status: 200 });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json(
      { error: err.message || 'Update failed' },
      { status: err.message === 'Current password is incorrect' ? 400 : 500 }
    );
  }
}
