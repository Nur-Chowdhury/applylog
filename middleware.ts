// middleware.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/history/:path*",
        "/analytics/:path*", // Protected route for your new analytics metrics page
    ],
};