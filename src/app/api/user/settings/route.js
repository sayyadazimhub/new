import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { settingsService } from '@/services/userService/settingsService';

export async function GET(request) {
    try {
        const token = (await cookies()).get('user-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const settings = await settingsService.getSettings(decoded.id);

        return NextResponse.json(settings);
    } catch (err) {
        console.error('Settings GET error:', err);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const token = (await cookies()).get('user-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const settings = await settingsService.updateSettings(decoded.id, body);

        return NextResponse.json(settings);
    } catch (err) {
        console.error('Settings PUT error:', err);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
