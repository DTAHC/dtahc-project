import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cette fonction peut être marquée `async` si on utilise `await` à l'intérieur
export function middleware(request: NextRequest) {
  // Pour le développement, désactiver temporairement l'authentification
  // En production, cela vérifie normalement l'authentification
  const isAuthenticated = true; // En développement, supposez que l'utilisateur est authentifié
  
  // Vérifier si la requête est pour une page protégée
  const isProtectedPage = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/clients') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/comptable') ||
    request.nextUrl.pathname.startsWith('/communication');

  // Si c'est une page protégée et que l'utilisateur n'est pas authentifié, rediriger vers le login
  if (isProtectedPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Sinon, continuer normalement
  return NextResponse.next();
}

// Configurer les chemins qui activeront ce middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clients/:path*',
    '/admin/:path*',
    '/comptable/:path*',
    '/communication/:path*',
  ],
};