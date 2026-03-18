"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Users, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const syncAzureUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.details || data.error || "Unknown Error fetching users");
            }

            setUsers(data.users);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load initial users if we've already synced before, or trigger a load
    useEffect(() => {
        // syncAzureUsers(); // Left manual so they can click the button first mentally
    }, []);

    return (
        <div className="flex-1 p-6 md:p-10 w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Control Panel</h1>
                <p className="text-muted-foreground text-lg">Manage users, roles, and ingest corporate documents.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload Component */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Ingest Policies</h3>
                        <p className="text-muted-foreground max-w-[280px] mx-auto">Drag and drop PDF or DOCX files here to parse and add to the Knowledge Graph.</p>
                    </div>
                    <Button className="mt-4 px-8" size="lg">Select Files</Button>
                </div>

                {/* AD Users Component */}
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col max-h-[400px]">
                    <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center shrink-0">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Azure AD Users Directory
                        </h2>
                        <Button size="sm" variant="outline" onClick={syncAzureUsers} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            Sync
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {error ? (
                            <div className="p-8 flex flex-col items-center justify-center text-center text-destructive m-6">
                                <AlertCircle className="h-10 w-10 text-destructive/50 mb-3" />
                                <p className="text-sm font-medium">Graph API Access Denied</p>
                                <p className="text-xs text-destructive/80 mt-1 max-w-[250px]">{error}</p>
                            </div>
                        ) : users.length > 0 ? (
                            <div className="divide-y divide-border">
                                {users.map((u) => (
                                    <div key={u.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{u.name}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-md inline-block">AD Member</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl m-6 bg-muted/5">
                                <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <p className="text-lg font-medium mb-1">No Directory Synced</p>
                                <p className="text-sm">Click the Sync button to fetch your Microsoft organizational users directly through MS Graph.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
