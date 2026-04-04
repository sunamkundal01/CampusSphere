import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Firebase Auth state is managed client-side, so the middleware
// simply lets all requests through. Route protection is handled
// by the AuthGuard component on protected pages.
export function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
