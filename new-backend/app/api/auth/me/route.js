export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import User from '@/models/User.js';
import { initDB } from '@/lib/db.js';

// GET /api/auth/me — returns logged-in user (no password)
export async function GET() {
    await initDB();
    try {
        const authUser = await verifyAuth();
        const user = await User.findByPk(authUser.id, {
            attributes: { exclude: ['password'] },
        });
        if (!user) return NextResponse.json({ msg: 'User not found' }, { status: 404 });
        return NextResponse.json(user);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ msg: 'Server error' }, { status: 500 });
    }
}

// POST /api/auth/logout — clears the auth cookie
export async function POST() {
    const response = NextResponse.json({ msg: 'Logged out' });
    response.cookies.set('token', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/',
    });
    return response;
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}
