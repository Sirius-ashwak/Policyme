import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import OktaProvider from "next-auth/providers/okta";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID || "mock-azure-client-id",
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "mock-azure-secret",
            tenantId: process.env.AZURE_AD_TENANT_ID || "mock-azure-tenant",
            // You can map Azure AD App Roles to NextAuth using the profile callback
            profile(profile) {
                return {
                    id: profile.oid,
                    name: profile.name,
                    email: profile.preferred_username,
                    // Force Admins for now since we haven't configured Enterprise App Roles in Azure yet!
                    // In production, this would look at `profile.roles`
                    role: "Admin",
                }
            }
        }),
        OktaProvider({
            clientId: process.env.OKTA_CLIENT_ID || "mock-okta-client-id",
            clientSecret: process.env.OKTA_CLIENT_SECRET || "mock-okta-client-secret",
            issuer: process.env.OKTA_ISSUER || "https://mock-okta.com/oauth2/default",
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    // Assuming Okta passes groups in profile.groups
                    role: profile.groups?.includes("Admin") ? "Admin" : 
                          profile.groups?.includes("Manager") ? "Manager" : "Adjuster",
                }
            }
        }),
        CredentialsProvider({
            name: "Demo Roles",
            credentials: {
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.role) return null;
                
                const role = credentials.role;
                
                // Return a mock user based on the selected role
                if (role === "Admin") {
                    return { id: "1", name: "Sarah Admin", email: "admin@insurai.com", role: "Admin" };
                } else if (role === "Adjuster") {
                    return { id: "2", name: "John Adjuster", email: "adjuster@insurai.com", role: "Adjuster" };
                } else if (role === "Underwriter") {
                    return { id: "3", name: "David Underwriter", email: "underwriter@insurai.com", role: "Underwriter" };
                } else if (role === "Customer") {
                    return { id: "4", name: "Ramesh Customer", email: "customer@insurai.com", role: "Customer" };
                }
                
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Persist the role to the token right after sign in
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.user.role = token.role as string;
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
