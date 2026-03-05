export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import Product from '@/models/Product.js';
import { initDB } from '@/lib/db.js';

// PUT /api/products/[id]
export async function PUT(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();
        const product = await Product.findOne({ where: { id: params.id, UserId: user.id } });
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        const body = await request.json();
        await product.update(body);
        return NextResponse.json(product);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

// DELETE /api/products/[id]
export async function DELETE(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();
        const product = await Product.findOne({ where: { id: params.id, UserId: user.id } });
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        await product.destroy();
        return NextResponse.json({ message: 'Product deleted' });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
