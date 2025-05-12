import NextAuth from "next-auth";

const handler = NextAuth({
    debug: true,
    providers: [
        {
            id: "tesla",
            name: "Tesla",
            type: "oauth",
            version: "2.0",
            authorization: {
                url: "https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/authorize",
                params: {
                    client_id: process.env.TESLA_CLIENT_ID,
                    response_type: "code",
                    scope: "openid offline_access vehicle_device_data",
                    code_challenge_method: "S256"   // Tesla requires PKCE
                },
            },
            token: {
                url: "https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token",
                params: { audience: "https://fleet-api.prd.na.vn.cloud.tesla.com" },
            },
            userinfo: "https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/users/me",
            // Map Tesla's payload into the shape NextAuth expects
            profile(profile) {
                return {
                    id: profile.user_id ?? profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: null,   // Tesla's API doesn't provide an avatar
                };
            },
            clientId: process.env.TESLA_CLIENT_ID,
            clientSecret: process.env.TESLA_CLIENT_SECRET,
            checks: ["pkce", "state"],          // enables built‑in PKCE + CSRF
        },
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // You can customize redirect logic here
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
        async session({ session, token }) {
            // Add access token to session if needed
            if (token?.accessToken) {
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
        async jwt({ token, account }) {
            // Persist the access token to the token
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            return token;
        }
    }
});

// Expose the handler for the HTTP verbs NextAuth uses
export { handler as GET, handler as POST }
