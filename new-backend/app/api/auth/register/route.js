export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User.js';
import sequelize, { initDB } from '@/lib/db.js';

// GET /api/auth/register — POST
export async function POST(request) {
    await initDB();
    const { name, email, password } = await request.json();

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({ name, email, password: hashedPassword });

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '100h' });

        const response = NextResponse.json({ msg: 'User registered successfully' }, { status: 201 });
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

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}
