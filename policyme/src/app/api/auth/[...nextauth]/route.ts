import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { resolveRole, getDefaultRedirect } from "@/config/roles";

// ── Build the providers list dynamically ──────────────────────────

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: resolveRole(profile.email),
                };
            },
        })
    );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: String(profile.id),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: resolveRole(profile.email),
                };
            },
        })
    );
}

if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID) {
    providers.push(
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            profile(profile) {
                return {
                    id: profile.oid,
                    name: profile.name,
                    email: profile.preferred_username,
                    role: resolveRole(profile.preferred_username),
                };
            },
        })
    );
}

// ─── Demo Credentials Provider (gated behind env var) ───────────
if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    providers.push(
        CredentialsProvider({
            name: "Demo Roles",
            credentials: {
                role: { label: "Role", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.role) return null;

                const role = credentials.role;
                const demoUsers: Record<string, { id: string; name: string; email: string; role: string }> = {
                    Admin:       { id: "demo-1", name: "Sarah Admin",       email: "admin@insurai.com",       role: "Admin" },
                    Adjuster:    { id: "demo-2", name: "John Adjuster",     email: "adjuster@insurai.com",    role: "Adjuster" },
                    Underwriter: { id: "demo-3", name: "David Underwriter", email: "underwriter@insurai.com", role: "Underwriter" },
                    Manager:     { id: "demo-4", name: "Lisa Manager",      email: "manager@insurai.com",     role: "Manager" },
                    Customer:    { id: "demo-5", name: "Ramesh Customer",   email: "customer@insurai.com",    role: "Customer" },
                };

                return demoUsers[role] || null;
            },
        })
    );
}

// ── NextAuth Configuration ────────────────────────────────────────

export const authOptions: NextAuthOptions = {
    providers,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            // Persist role & image to the JWT right after sign in
            if (user) {
                token.role = user.role;
                token.picture = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            // Expose role & image to the client session
            session.user.role = token.role as string;
            if (token.picture) {
                session.user.image = token.picture as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If url is relative, prefix with baseUrl
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allow callbacks on same origin
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
