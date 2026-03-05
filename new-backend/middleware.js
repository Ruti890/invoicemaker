import { NextResponse } from "next/server";

const allowedOrigin = "https://invoicemaker-livid.vercel.app";

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    "Access-Control-Allow-Credentials": "true",
};

export function middleware(request) {
    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = origin === allowedOrigin;

    // Intercept OPTIONS preflight requests and return 200 OK
    if (request.method === "OPTIONS") {
        const preflightHeaders = {
            ...(isAllowedOrigin && { "Access-Control-Allow-Origin": allowedOrigin }),
            ...corsOptions,
        };
        return NextResponse.json({}, { headers: preflightHeaders });
    }

    // Pass down the request to the route handler for other methods
    const response = NextResponse.next();

    // Attach CORS headers to the actual response
    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: "/api/:path*",
};
