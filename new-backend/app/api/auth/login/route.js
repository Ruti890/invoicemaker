
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User.js';
import { initDB } from '@/lib/db.js';

export async function POST(request) {
    await initDB();
    const { email, password } = await request.json();

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ msg: 'Invalid Credentials' }, { status: 400 });
        }

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '100h' });

        const response = NextResponse.json({ msg: 'Login successful' });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 360000,
            path: '/',
            sameSite: 'lax',
        });
        return response;
    } catch (err) {
        console.error(err.message);
        return NextResponse.json({ msg: 'Server error' }, { status: 500 });
    }
}
