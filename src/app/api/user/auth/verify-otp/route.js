import { NextResponse } from 'next/server';
import { authService } from '@/services/userService/authService';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const { token, user } = await authService.verifyOtp(email, otp);

    const response = NextResponse.json(
      { message: 'Email verified successfully', user },
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
    console.error('OTP verify error:', err);
    return NextResponse.json(
      { error: err.message || 'Verification failed' },
      { status: err.message === 'Invalid or expired OTP' ? 400 : 500 }
    );
  }
}
