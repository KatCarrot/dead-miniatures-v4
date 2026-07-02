export { auth as middleware } from "@/auth";

/**
 * Protect only the admin surface. The public site (/, /showcase, /artwork/*)
 * stays open; hitting /admin (or the write API) without an allowlisted Google
 * session bounces to /login.
 */
export const config = {
  matcher: ["/admin/:path*"],
};
