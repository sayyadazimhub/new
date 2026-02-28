import { NextResponse } from 'next/server';
import { authService } from '@/services/adminService/authService';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { token, admin } = await authService.login(email, password);

    const response = NextResponse.json(
      { message: 'Login successful', admin },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: err.message || 'Login failed' },
      { status: err.message === 'Invalid credentials' ? 401 : 500 }
    );
  }
}
