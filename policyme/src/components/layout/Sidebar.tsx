"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Search,
    AlertTriangle,
    FileText,
    Settings,
    Users,
    UploadCloud,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const roleNavigation = {
    adjuster: [
        { name: "Claims Queue", href: "/dashboard/adjuster", icon: LayoutDashboard },
        { name: "Ask PolicyMe", href: "/dashboard/adjuster/ask", icon: Search },
        { name: "Saved Queries", href: "/dashboard/adjuster/saved", icon: FileText },
        { name: "Settings", href: "/dashboard/adjuster/settings", icon: Settings },
    ],
    manager: [
        { name: "Command Center", href: "/dashboard/manager", icon: LayoutDashboard },
        { name: "Active Conflicts", href: "/dashboard/manager/conflicts", icon: AlertTriangle },
        { name: "Reports", href: "/dashboard/manager/reports", icon: FileText },
        { name: "Settings", href: "/dashboard/manager/settings", icon: Settings },
    ],
    admin: [
        { name: "Users", href: "/dashboard/admin", icon: Users },
        { name: "Upload Documents", href: "/dashboard/admin/upload", icon: UploadCloud },
        { name: "Audit Logs", href: "/dashboard/admin/logs", icon: FileText },
        { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
};

export function Sidebar() {
    const pathname = usePathname();

    // Determine role based on URL path
    let currentRole: "adjuster" | "manager" | "admin" = "adjuster";
    if (pathname.includes("/manager")) currentRole = "manager";
    if (pathname.includes("/admin")) currentRole = "admin";

    const navigation = roleNavigation[currentRole];

    return (
        <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <div className="w-full space-y-4 pb-4">
                <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
                                    pathname === item.href
                                        ? "bg-muted text-primary font-medium"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
