import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { profileService } from '@/services/adminService/profileService';

export async function GET() {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const admin = await profileService.getProfile(decoded.id);
        return NextResponse.json(admin);
    } catch (error) {
        console.error('Admin Profile GET:', error);
        return NextResponse.json(
            { error: error.message === 'Admin not found' ? 'Admin not found' : 'Internal Server Error' },
            { status: error.message === 'Admin not found' ? 404 : 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const admin = await profileService.updateProfile(decoded.id, body);

        return NextResponse.json(admin);
    } catch (error) {
        console.error('Admin Profile PUT:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
