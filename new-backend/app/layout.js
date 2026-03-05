export const metadata = {
    title: 'InvoiceMaker Pro API',
    description: 'Next.js API backend for InvoiceMaker Pro',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
