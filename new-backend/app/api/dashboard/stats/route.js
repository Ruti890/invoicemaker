export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import { Invoice } from '@/models/Invoice.js';
import Client from '@/models/Client.js';
import Product from '@/models/Product.js';
import { initDB } from '@/lib/db.js';

// GET /api/dashboard/stats
export async function GET() {
    await initDB();
    try {
        const user = await verifyAuth();

        const totalInvoices = await Invoice.count({ where: { UserId: user.id } });
        const totalClients = await Client.count({ where: { UserId: user.id } });
        const totalProducts = await Product.count({ where: { UserId: user.id } });
        const totalRevenue = (await Invoice.sum('total', { where: { UserId: user.id } })) || 0;

        const recentInvoices = await Invoice.findAll({
            where: { UserId: user.id },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: Client, attributes: ['name'] }],
        });

        return NextResponse.json({
            totalInvoices,
            totalClients,
            totalProducts,
            totalRevenue,
            recentInvoices,
        });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
