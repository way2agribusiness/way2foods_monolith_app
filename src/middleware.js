// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
    const res = NextResponse.next();

    const origin = req.headers.get('origin');
    const allowedOrigins = [
        'https://way2foods.in',
        'https://www.way2foods.in',
        'http://192.168.1.43:3002'
    ];

    // Validate origin and set CORS headers
    if (origin && allowedOrigins.includes(origin)) {
        res.headers.set('Access-Control-Allow-Origin', origin);
        res.headers.set('Vary', 'Origin'); // Critical for proper caching behavior
    }

    // Set CORS methods and headers
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: Object.fromEntries(res.headers)
        });
    }

    return res;
}

export const config = {
    matcher: '/api/:path*',
};