import { NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import { ConfidentialClientApplication } from "@azure/msal-node";

// Requires AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID in .env.local
const msalConfig = {
    auth: {
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
    }
};

const cca = new ConfidentialClientApplication(msalConfig);

export async function GET() {
    try {
        const tenantId = process.env.AZURE_AD_TENANT_ID;
        if (!tenantId || tenantId === "common") {
            throw new Error("You must set a specific AZURE_AD_TENANT_ID in .env.local (a GUID), not 'common', for the background sync to work.");
        }

        // Attempt to fetch an application Token (Client Credentials Flow)
        // This requires "User.Read.All" Application Permission configured in Azure AD
        const authResponse = await cca.acquireTokenByClientCredential({
            scopes: ["https://graph.microsoft.com/.default"],
        });

        if (!authResponse?.accessToken) {
            throw new Error("Could not acquire an App access token.");
        }

        const client = Client.init({
            authProvider: (done) => {
                done(null, authResponse.accessToken);
            }
        });

        // Query up to 100 users, mapped to the format our frontend table expects
        const adUsers = await client.api("/users")
            .select("id,displayName,mail,userPrincipalName,jobTitle")
            .top(100)
            .get();

        // Map MsGraph schema to our app's internal user format
        const mappedUsers = adUsers.value.map((u: any) => ({
            id: u.id,
            name: u.displayName,
            email: u.mail || u.userPrincipalName, 
            role: "Mapped via AppRole",
            department: u.jobTitle || "Organization",
            status: "Active"
        }));

        return NextResponse.json({ users: mappedUsers }, { status: 200 });

    } catch (err: any) {
        console.error("Graph API Error:", err.message);
        
        // Return structured error fallback to tell UI that Admin Consent is probably missing
        return NextResponse.json({ 
            error: "Failed to connect to MS Graph. Did you grant 'User.Read.All' Application permissions and Admin Consent in Azure?",
            details: err.message
        }, { status: 500 });
    }
}