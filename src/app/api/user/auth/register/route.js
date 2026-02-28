import { NextResponse } from 'next/server';
import { authService } from '@/services/userService/authService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const { email: registeredEmail } = await authService.register({ name, email, password, phone });

    return NextResponse.json(
      { message: 'Registration successful. Check your email for the OTP to verify your account.', email: registeredEmail },
      { status: 201 }
    );
  } catch (err) {
    console.error('User register error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
