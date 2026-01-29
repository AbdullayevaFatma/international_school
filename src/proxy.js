import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const role = sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;

  console.log("Middleware pathname:", req.nextUrl.pathname);
  console.log("Middleware role:", role);
  console.log("Middleware userId:", userId);

  if (!userId && req.nextUrl.pathname !== "/") {
    console.log("Middleware redirecting to / (not logged in)");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/" && userId && role) {
    console.log("Middleware redirecting to /" + role);
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  if (userId && role) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        console.log("Middleware redirecting to /" + role + " (role mismatch)");
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};