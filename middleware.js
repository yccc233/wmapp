import {NextResponse} from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    console.log("req.nextUrl,", request.cookies.has('userid'), request.nextUrl.pathname)
    if (request.nextUrl.pathname === "/riskview/login") {
        return NextResponse.next();
    } else if (request.cookies.has('userid')) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL('/riskview/login', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/riskview/:path*'],
}