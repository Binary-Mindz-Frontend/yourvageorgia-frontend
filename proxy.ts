import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const authRoutes = ['/login', '/dashboard/admin/login'];
const userRoutes = ['/profile'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;

    let userRole: string | null = null;
    if (accessToken) {
        try {
            const decoded: any = jwtDecode(accessToken);
            userRole = decoded?.role ? decoded.role.toLowerCase() : null;
        } catch (e) {
            console.error('Middleware JWT decode failed:', e);
            userRole = null;
        }
    }

    // 1. If hitting auth routes (login pages)
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        if (accessToken) {
            if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/dashboard/admin/overview', request.url));
            }
            return NextResponse.redirect(new URL('/profile', request.url));
        }
        return NextResponse.next();
    }

    // 2. Protect Admin Routes
    if (pathname.startsWith('/dashboard/admin')) {
        if (!accessToken || userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard/admin/login', request.url));
        }
        return NextResponse.next();
    }

    // 3. Protect User Routes
    if (userRoutes.some((route) => pathname.startsWith(route))) {
        if (!accessToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/admin/:path*',
        '/profile/:path*',
        '/login',
    ],
};
