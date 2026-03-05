import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Verifies the JWT from the httpOnly cookie.
 * Returns the decoded user payload { id, role }
 * OR throws a NextResponse (401) if not authenticated.
 */
export async function verifyAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw NextResponse.json({ msg: 'No token, authorization denied' }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.user; // { id, role }
    } catch {
        throw NextResponse.json({ msg: 'Token is not valid' }, { status: 401 });
    }
}

/**
 * Same as verifyAuth but also checks for admin role.
 * Throws a NextResponse (403) if user is not admin.
 */
export async function verifyAdmin() {
    const user = await verifyAuth();
    if (user.role !== 'admin') {
        throw NextResponse.json({ msg: 'Access denied. Admin only.' }, { status: 403 });
    }
    return user;
}
