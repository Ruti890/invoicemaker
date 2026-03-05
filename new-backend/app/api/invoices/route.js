
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import { Invoice, InvoiceItem } from '@/models/Invoice.js';
import Client from '@/models/Client.js';
import Product from '@/models/Product.js';
import User from '@/models/User.js';
import sequelize, { initDB } from '@/lib/db.js';

// GET /api/invoices
export async function GET() {
    await initDB();
    try {
        const user = await verifyAuth();
        const invoices = await Invoice.findAll({
            where: { UserId: user.id },
            include: [{ model: Client }, { model: InvoiceItem }],
            order: [['createdAt', 'DESC']],
        });
        return NextResponse.json(invoices);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/invoices — create invoice (with transaction)
export async function POST(request) {
    await initDB();
    const t = await sequelize.transaction();
    try {
        const user = await verifyAuth();
        const { clientId, items, taxRate = 0, notes, dueDate } = await request.json();

        let subtotal = 0;
        const invoiceItemsData = [];

        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction: t });
            if (!product) throw new Error(`Product ${item.productId} not found`);
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
            }

            const price = parseFloat(product.price);
            const itemTotal = item.quantity * price;
            subtotal += itemTotal;

            invoiceItemsData.push({
                description: product.name,
                quantity: item.quantity,
                price,
                total: itemTotal,
                InvoiceId: null,
                productId: product.id,
            });

            await product.decrement('stock', { by: item.quantity, transaction: t });
        }

        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;

        const invoice = await Invoice.create(
            { ClientId: clientId, date: new Date(), dueDate, subtotal, tax, total, notes, status: 'sent', UserId: user.id },
            { transaction: t }
        );

        for (const itemData of invoiceItemsData) {
            itemData.InvoiceId = invoice.id;
            await InvoiceItem.create(itemData, { transaction: t });
        }

        await t.commit();

        const finalInvoice = await Invoice.findByPk(invoice.id, { include: [Client, InvoiceItem] });
        return NextResponse.json(finalInvoice, { status: 201 });
    } catch (err) {
        await t.rollback();
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
