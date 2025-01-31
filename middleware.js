import {NextResponse} from 'next/server';

export function middleware(request) {
    if (request.nextUrl.pathname === "/wmapp/login") {
        return NextResponse.next();
    } else if (request.cookies.has('userid')) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL('/wmapp/login', request.url));
    }
}

export const config = {
    matcher: ['/wmapp/:path*'],
}