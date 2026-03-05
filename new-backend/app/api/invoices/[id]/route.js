export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import { Invoice, InvoiceItem } from '@/models/Invoice.js';
import Client from '@/models/Client.js';
import Product from '@/models/Product.js';
import sequelize, { initDB } from '@/lib/db.js';

// GET /api/invoices/[id]
export async function GET(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();
        const invoice = await Invoice.findOne({
            where: { id: params.id, UserId: user.id },
            include: [{ model: Client }, { model: InvoiceItem }],
        });
        if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        return NextResponse.json(invoice);
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT /api/invoices/[id]
export async function PUT(request, { params }) {
    await initDB();
    const t = await sequelize.transaction();
    try {
        const user = await verifyAuth();
        const { clientId, items, taxRate = 0, notes, dueDate } = await request.json();

        const invoice = await Invoice.findOne({
            where: { id: params.id, UserId: user.id },
            include: [InvoiceItem],
            transaction: t,
        });
        if (!invoice) {
            await t.rollback();
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Restore stock from old items
        for (const oldItem of invoice.InvoiceItems) {
            const product = await Product.findByPk(oldItem.productId, { transaction: t });
            if (product) await product.increment('stock', { by: oldItem.quantity, transaction: t });
        }

        await InvoiceItem.destroy({ where: { InvoiceId: invoice.id }, transaction: t });

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
                InvoiceId: invoice.id,
                productId: item.productId,
            });

            await product.decrement('stock', { by: item.quantity, transaction: t });
        }

        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;

        await invoice.update({ ClientId: clientId, dueDate, subtotal, tax, total, notes }, { transaction: t });

        for (const itemData of invoiceItemsData) {
            await InvoiceItem.create(itemData, { transaction: t });
        }

        await t.commit();

        const updatedInvoice = await Invoice.findByPk(invoice.id, { include: [Client, InvoiceItem] });
        return NextResponse.json(updatedInvoice);
    } catch (err) {
        await t.rollback();
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

// DELETE /api/invoices/[id]
export async function DELETE(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();
        const invoice = await Invoice.findOne({ where: { id: params.id, UserId: user.id } });
        if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

        await InvoiceItem.destroy({ where: { InvoiceId: invoice.id } });
        await invoice.destroy();

        return NextResponse.json({ message: 'Invoice deleted' });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
