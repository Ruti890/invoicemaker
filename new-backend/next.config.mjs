/** @type {import('next').NextConfig} */
const nextConfig = {
    // Exclude heavy native dependencies from being bundled by Vercel
    experimental: {
        serverComponentsExternalPackages: ['sequelize', 'pg', 'pg-hstore', 'bcryptjs', 'jsonwebtoken', 'pdfkit'],
    },

    // Native Next.js CORS configuration for the frontend
    async headers() {
        return [
            {
                // Apply CORS to all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "https://invoicemaker-livid.vercel.app" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                ]
            }
        ]
    }
};

export default nextConfig;
