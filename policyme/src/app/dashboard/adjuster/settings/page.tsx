"use client";

import { User, Bell, Shield, PaintBucket } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdjusterSettingsPage() {
    return (
        <div className="flex-1 p-6 md:p-10 max-w-4xl w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-muted-foreground text-lg">Manage your personal preferences.</p>
            </div>

            <div className="space-y-8">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-lg">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium">Policy Update Alerts</Label>
                                <p className="text-sm text-muted-foreground">Receive emails when major HR/IT policies are updated.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium">Suggested Actions</Label>
                                <p className="text-sm text-muted-foreground">Show AI-driven personalized action items on dashboard.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="p-4 bg-muted/30 border-b border-border flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-lg">Account Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Name</Label>
                                <p className="font-medium mt-1">Sarah Johnson</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
                                <p className="font-medium mt-1">sarah.j@policyme-demo.com</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Department</Label>
                                <p className="font-medium mt-1">Engineering</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Role</Label>
                                <div className="mt-1 inline-flex items-center rounded-md border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    Adjuster
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
