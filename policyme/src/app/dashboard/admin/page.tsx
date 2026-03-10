"use client";

import { UploadCloud, Users, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    return (
        <div className="flex-1 p-6 md:p-10 w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Control Panel</h1>
                <p className="text-muted-foreground text-lg">Manage users, roles, and ingest corporate documents.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Ingest Policies</h3>
                        <p className="text-muted-foreground max-w-[280px] mx-auto">Drag and drop PDF or DOCX files here to parse and add to the Knowledge Graph.</p>
                    </div>
                    <Button className="mt-4 px-8" size="lg">Select Files</Button>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            User Management
                        </h2>
                        <Button size="sm" variant="outline">Invite User</Button>
                    </div>
                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl m-6 bg-muted/5">
                        <FileCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium mb-1">SSO Directory Sync</p>
                        <p className="text-sm">Connect Okta or Azure AD to automatically populate user roles and access groups.</p>
                        <Button variant="link" className="mt-2 text-primary">Configure Integration</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
