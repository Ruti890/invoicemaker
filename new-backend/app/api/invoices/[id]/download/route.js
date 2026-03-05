export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth.js';
import { Invoice, InvoiceItem } from '@/models/Invoice.js';
import Client from '@/models/Client.js';
import { generateInvoicePDFBuffer } from '@/services/pdfService.js';
import { initDB } from '@/lib/db.js';

// GET /api/invoices/[id]/download
export async function GET(request, { params }) {
    await initDB();
    try {
        const user = await verifyAuth();

        const invoice = await Invoice.findOne({
            where: { id: params.id, UserId: user.id },
            include: [Client, InvoiceItem],
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        const pdfBuffer = await generateInvoicePDFBuffer(invoice);

        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="invoice-${invoice.number}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });
    } catch (err) {
        if (err instanceof Response) return err;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
