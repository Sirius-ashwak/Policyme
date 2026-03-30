"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
    name: string;
    href: string;
    icon: string;
};

type SidebarSection = {
    label?: string;
    items: NavItem[];
};

const roleSidebars: Record<string, { header: { label: string; subtitle: string }; sections: SidebarSection[]; cta?: { label: string; icon: string; href: string } }> = {
    portal: {
        header: { label: "Membership Status", subtitle: "Premium Member" },
        sections: [
            {
                items: [
                    { name: "Overview", href: "/portal", icon: "dashboard" },
                    { name: "Claims History", href: "/portal/claims", icon: "description" },
                    { name: "Policy Vault", href: "/portal/policy", icon: "folder_shared" },
                    { name: "Billing & Payments", href: "/portal/billing", icon: "payments" },
                    { name: "Security Settings", href: "/portal/settings", icon: "settings" },
                ],
            },
        ],
        cta: { label: "File New Claim", icon: "add", href: "/portal/submit" },
    },
    adjuster: {
        header: { label: "Deep-Tech Workspace", subtitle: "Adjuster View" },
        sections: [
            {
                items: [
                    { name: "Claims Queue", href: "/dashboard/adjuster", icon: "list_alt" },
                    { name: "Active Adjudications", href: "/dashboard/adjuster/adjudications", icon: "gavel" },
                    { name: "Policy Database", href: "/dashboard/adjuster/policies", icon: "database" },
                ],
            },
            {
                label: "GraphRAG Search",
                items: [
                    { name: "Knowledge Graph", href: "/dashboard/adjuster/ask", icon: "hub" },
                    { name: "AI Insights", href: "/dashboard/adjuster/insights", icon: "auto_awesome" },
                ],
            },
        ],
    },
    underwriter: {
        header: { label: "Underwriting", subtitle: "Workspace" },
        sections: [
            {
                items: [
                    { name: "Application Queue", href: "/dashboard/underwriter", icon: "list_alt" },
                    { name: "Risk Assessments", href: "/dashboard/underwriter/assessments", icon: "assessment" },
                    { name: "Performance Metrics", href: "/dashboard/underwriter/metrics", icon: "monitoring" },
                ],
            },
        ],
    },
    manager: {
        header: { label: "Management", subtitle: "Command Center" },
        sections: [
            {
                items: [
                    { name: "Command Center", href: "/dashboard/manager", icon: "dashboard" },
                    { name: "Active Conflicts", href: "/dashboard/manager/conflicts", icon: "warning" },
                    { name: "Reports", href: "/dashboard/manager/reports", icon: "description" },
                    { name: "Settings", href: "/dashboard/manager/settings", icon: "settings" },
                ],
            },
        ],
    },
    admin: {
        header: { label: "Administration", subtitle: "System Controls" },
        sections: [
            {
                items: [
                    { name: "Users", href: "/dashboard/admin", icon: "group" },
                    { name: "Upload Documents", href: "/dashboard/admin/upload", icon: "upload_file" },
                    { name: "Audit Logs", href: "/dashboard/admin/logs", icon: "description" },
                    { name: "Settings", href: "/dashboard/admin/settings", icon: "settings" },
                ],
            },
        ],
    },
};

function detectRole(pathname: string): string {
    if (pathname.startsWith("/portal")) return "portal";
    if (pathname.includes("/adjuster")) return "adjuster";
    if (pathname.includes("/underwriter")) return "underwriter";
    if (pathname.includes("/manager")) return "manager";
    if (pathname.includes("/admin")) return "admin";
    return "adjuster";
}

export function Sidebar() {
    const pathname = usePathname();
    const role = detectRole(pathname);
    const config = roleSidebars[role];

    if (!config) return null;

    return (
        <aside className="h-screen w-64 hidden lg:flex flex-col fixed left-0 top-16 bg-slate-50 dark:bg-slate-950 border-r border-[var(--insurai-outline-variant)]/10 z-40">
            {/* Header */}
            <div className="px-8 py-6 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-[Inter] mb-1">
                    {config.header.label}
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {role === "portal" && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    {config.header.subtitle}
                </p>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 space-y-6 px-4 overflow-y-auto">
                {config.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                        {section.label && (
                            <div className="px-4 py-2 mb-1">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-[Inter]">
                                    {section.label}
                                </p>
                            </div>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || 
                                    (item.href !== "/portal" && item.href !== "/dashboard/adjuster" && item.href !== "/dashboard/underwriter" && pathname.startsWith(item.href));
                                const isExactActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                            isExactActive
                                                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold"
                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1"
                                        )}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto p-4">
                {/* Support link */}
                <Link
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-[20px]">help</span>
                    <span>Support</span>
                </Link>

                {/* CTA Button */}
                {config.cta && (
                    <Link href={config.cta.href} className="block mt-3">
                        <button className="w-full py-4 primary-gradient text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-sm">{config.cta.icon}</span>
                            <span>{config.cta.label}</span>
                        </button>
                    </Link>
                )}
            </div>
        </aside>
    );
}
