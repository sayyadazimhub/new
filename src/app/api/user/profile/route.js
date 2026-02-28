import { NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/auth';
import { profileService } from '@/services/userService/profileService';

export async function GET(request) {
    try {
        const token = request.cookies.get('user-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const profile = await profileService.getProfile(decoded.id);
        return NextResponse.json(profile);
    } catch (err) {
        console.error('User Profile GET:', err);
        return NextResponse.json(
            { error: err.message === 'User not found' ? 'User not found' : 'Failed to fetch profile' },
            { status: err.message === 'User not found' ? 404 : 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const token = request.cookies.get('user-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const updated = await profileService.updateProfile(decoded.id, body);

        return NextResponse.json(updated);
    } catch (err) {
        console.error('User Profile PUT:', err);
        return NextResponse.json(
            { error: err.message === 'Name is required' ? 'Name is required' : 'Failed to update profile' },
            { status: err.message === 'Name is required' ? 400 : 500 }
        );
    }
}
