/** @type {import('next').NextConfig} */
const nextConfig = {
    // These packages use native Node.js modules and must NOT be bundled by Next.js/Turbopack
    serverExternalPackages: ['sequelize', 'pg', 'pg-hstore', 'bcryptjs', 'jsonwebtoken', 'pdfkit'],

    // CORS Headers for the local frontend (Vite runs on port 5173 by default)
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:5173" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};

export default nextConfig;
