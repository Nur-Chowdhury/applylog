// auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize() {
                return null;
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;