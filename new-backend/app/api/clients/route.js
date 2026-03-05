export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import Client from '@/models/Client.js';
import User from '@/models/User.js';
import { initDB } from '@/lib/db.js';

// GET /api/clients
export async function GET() {
    await initDB();
    try {
        const user = await verifyAuth();
        const clients = await Client.findAll({ where: { UserId: user.id } });
        return NextResponse.json(clients);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/clients
export async function POST(request) {
    await initDB();
    try {
        const user = await verifyAuth();
        const body = await request.json();
        const nit = body.nit || `NIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const client = await Client.create({ ...body, nit, UserId: user.id });
        return NextResponse.json(client, { status: 201 });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
