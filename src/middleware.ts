import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from '@clerk/nextjs/server';
import { ROLE_TYPE } from '@/constants';
const isAdminRoute = createRouteMatcher(['/admin', '/admin/(.*)']);

const isAuthRoute = createRouteMatcher(['/dashboard', '/dashboard/(.*)']);

const isProtectedRoute = createRouteMatcher([
  '/dashboard',
  '/dashboard/(.*)',
  '/profile',
  '/profile/(.*)',
  '/biolink',
  '/biolink/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const role = user.privateMetadata?.role;
    if (isAdminRoute(req) && role !== ROLE_TYPE.ADMIN) {
      return Response.redirect(new URL('/', req.url));
    }

    if (
      isAuthRoute(req) &&
      role !== ROLE_TYPE.USER &&
      role !== ROLE_TYPE.ADMIN
    ) {
      return Response.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
