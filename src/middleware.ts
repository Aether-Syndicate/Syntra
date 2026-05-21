// src/middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/log/:path*",
    "/api/dashboard/:path*",
    "/api/simulate/:path*",
    "/api/ai/:path*",
    "/api/goals/:path*",
    "/api/upload/:path*",
  ],
};