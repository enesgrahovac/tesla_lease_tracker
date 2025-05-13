import NextAuth from "next-auth";

const handler = NextAuth({
    debug: true,

    providers: [
        {
            id: "tesla",
            name: "Tesla",
            type: "oauth",
            version: "2.0",
            issuer: "https://fleet-auth.tesla.com/oauth2/v3/nts",


            // ────────── 1. AUTHORIZE STEP ──────────
            authorization: {
                url: "https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/authorize",
                params: {
                    client_id: process.env.TESLA_CLIENT_ID,
                    client_secret: process.env.TESLA_CLIENT_SECRET,
                    response_type: "code",
                    scope: "openid offline_access vehicle_device_data",
                    code_challenge_method: "S256",  // PKCE
                },
            },

            // ────────── 2. TOKEN STEP ──────────
            token: {
                url: "https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token",
                params: {
                    // both audience *and* issuer are mandatory
                    audience: "https://fleet-api.prd.na.vn.cloud.tesla.com",
                    issuer: "https://fleet-auth.tesla.com/oauth2/v3/nts",
                },
            },

            // ────────── 3. USERINFO STEP ──────────
            userinfo: "https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/users/me",

            profile(raw) {
                return {
                    id: raw.user_id ?? raw.sub,
                    name: raw.name,
                    email: raw.email,
                    image: null,
                };
            },
            client: {
                token_endpoint_auth_method: "client_secret_post",
            },
            clientId: process.env.TESLA_CLIENT_ID,
            clientSecret: process.env.TESLA_CLIENT_SECRET,

            checks: ["pkce", "state"],   // enables PKCE + CSRF
        },
    ],

    callbacks: {
        async jwt({ token, account }) {
            if (account?.access_token) token.accessToken = account.access_token;
            return token;
        },
        async session({ session, token }) {
            if (token?.accessToken) session.accessToken = token.accessToken as string;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Always redirect to /dashboard after sign in
            return `${baseUrl}/dashboard`;
        },
    },
});

export const GET = handler;
export const POST = handler;