"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard/admin", icon: "dashboard" },
    { name: "Monitoring", href: "/dashboard/admin/monitoring", icon: "monitoring" },
    { name: "Users", href: "/dashboard/admin/users", icon: "group" },
    { name: "AI Analytics", href: "/dashboard/admin/analytics", icon: "insights" },
    { name: "Graph Ops", href: "/dashboard/admin/graph", icon: "hub" },
    { name: "Audit", href: "/dashboard/admin/audit", icon: "history" }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 pt-16 flex flex-col gap-y-2 p-4 border-r border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 z-40">
            {/* Header Identity */}
            <div className="px-4 py-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                            terminal
                        </span>
                    </div>
                    <div>
                        <Link href="/dashboard/admin" className="block text-sm font-black tracking-tight text-slate-900 dark:text-slate-50 font-['Manrope'] hover:text-[var(--primary)] transition-colors">
                            Enterprise Console
                        </Link>
                        <p className="text-[10px] text-[var(--primary)] uppercase tracking-widest font-bold opacity-80">
                            V2.4.0-Stable
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const isExact = item.href === "/dashboard/admin";
                    const isActive = isExact 
                        ? pathname === item.href 
                        : (pathname === item.href || pathname.startsWith(`${item.href}/`));
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 font-['Manrope']",
                                isActive 
                                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-bold scale-[1.02]" 
                                    : "text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200 hover:translate-x-1"
                            )}
                        >
                            <span 
                                className="material-symbols-outlined" 
                                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Items */}
            <div className="mt-auto px-4 py-6 space-y-4">
                <button 
                    onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
                        loading: "Initializing model deployment...",
                        success: "Model deployed to staging successfully.",
                        error: "Deployment failed."
                    })}
                    className="w-full py-3 bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] text-white rounded-lg text-xs font-bold shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-transform"
                >
                    Deploy New Model
                </button>
                <div className="space-y-1">
                    <button onClick={() => toast("Opening Documentation...")} className="w-full flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors">
                        <span className="material-symbols-outlined text-sm">description</span>
                        <span>Documentation</span>
                    </button>
                    <button onClick={() => toast.success("All Systems Operational")} className="w-full flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors">
                        <span className="material-symbols-outlined text-sm text-green-500">cloud_done</span>
                        <span>System Status</span>
                    </button>
                    <Link href="/" className="flex items-center gap-3 px-2 py-2 mt-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <span>Exit Admin</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
