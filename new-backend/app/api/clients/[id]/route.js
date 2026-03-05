export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import Client from '@/models/Client.js';
import { initDB } from '@/lib/db.js';

// PUT /api/clients/[id]
export async function PUT(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();
        const client = await Client.findOne({ where: { id: params.id, UserId: user.id } });
        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        const body = await request.json();
        await client.update(body);
        return NextResponse.json(client);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

// DELETE /api/clients/[id]
export async function DELETE(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();
        const client = await Client.findOne({ where: { id: params.id, UserId: user.id } });
        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        await client.destroy();
        return NextResponse.json({ message: 'Client deleted' });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
