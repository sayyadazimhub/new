import { NextResponse } from 'next/server';
import { authService } from '@/services/userService/authService';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { token, user } = await authService.login(email, password);

    const response = NextResponse.json(
      { message: 'Login successful', user },
      { status: 200 }
    );

    response.cookies.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('User login error:', err);
    return NextResponse.json(
      { error: err.message || 'Login failed' },
      { status: (err.message === 'Invalid credentials' || err.message.includes('verify your email')) ? 401 : 500 }
    );
  }
}
