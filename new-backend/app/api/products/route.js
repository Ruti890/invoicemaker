export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import Product from '@/models/Product.js';
import { initDB } from '@/lib/db.js';

// GET /api/products
export async function GET() {
    await initDB();
    try {
        const user = await verifyAuth();
        const products = await Product.findAll({ where: { UserId: user.id } });
        return NextResponse.json(products);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/products
export async function POST(request) {
    await initDB();
    try {
        const user = await verifyAuth();
        const body = await request.json();
        const product = await Product.create({ ...body, UserId: user.id });
        return NextResponse.json(product, { status: 201 });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
