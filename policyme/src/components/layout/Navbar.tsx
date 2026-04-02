"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "@/components/ui/Logo";

/** Role-based navigation: only show links the user's role can access */
const NAV_LINKS: { labelKey: string; href: string; roles: string[] }[] = [
    { labelKey: "nav.portal",      href: "/portal",                roles: ["Customer", "Admin"] },
    { labelKey: "nav.underwriter", href: "/dashboard/underwriter", roles: ["Underwriter", "Admin"] },
    { labelKey: "nav.adjuster",    href: "/dashboard/adjuster",    roles: ["Adjuster", "Admin"] },
    { labelKey: "nav.manager",     href: "/dashboard/manager",     roles: ["Manager", "Admin"] },
    { labelKey: "nav.admin",       href: "/dashboard/admin",       roles: ["Admin"] },
];

export function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const { t } = useLanguage();

    const userRole = session?.user?.role || "";
    const notificationsHref = session
        ? {
            Customer: "/portal/claims",
            Adjuster: "/dashboard/adjuster/adjudications",
            Underwriter: "/dashboard/underwriter/assessments",
            Manager: "/dashboard/manager/conflicts",
            Admin: "/dashboard/admin/logs",
        }[userRole] || "/portal"
        : "/login";

    const settingsHref = session
        ? {
            Customer: "/portal/settings",
            Adjuster: "/dashboard/adjuster/settings",
            Underwriter: "/dashboard/underwriter/metrics",
            Manager: "/dashboard/manager/settings",
            Admin: "/dashboard/admin/settings",
        }[userRole] || "/portal/settings"
        : "/login";

    // Filter nav links based on user's role
    const visibleLinks = NAV_LINKS.filter(link => link.roles.includes(userRole)).map(link => ({
        label: t(link.labelKey),
        href: link.href,
        active: pathname.startsWith(link.href),
    }));

    return (
        <header className="fixed top-0 w-full z-50 glass-header shadow-[0_1px_0_0_rgba(0,0,0,0.05)] h-16">
            <div className="flex justify-between items-center h-full px-6 w-full max-w-[1920px] mx-auto font-[Manrope] tracking-tight">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center shadow-md shadow-blue-200/50">
                            <Logo className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">
                            InsurAI
                        </span>
                    </Link>

                    {/* Role Navigation Tabs — only show links user has access to */}
                    {session && (
                        <nav className="hidden md:flex items-center gap-6">
                            {visibleLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${
                                        link.active
                                            ? "text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400 pb-1"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                {/* Right Side: Actions + User */}
                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Notifications */}
                    <Link
                        href={notificationsHref}
                        aria-label="Notifications"
                        className="p-2 text-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                    </Link>

                    {/* Settings */}
                    <Link
                        href={settingsHref}
                        aria-label="Settings"
                        className="p-2 text-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200"
                    >
                        <span className="material-symbols-outlined">settings</span>
                    </Link>

                    {/* User Profile / Auth */}
                    {status === "loading" ? (
                        <div className="h-8 w-20 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-full" />
                    ) : session ? (
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 p-1 pl-3 bg-slate-100 dark:bg-slate-800 rounded-full border border-[var(--insurai-outline-variant)]/20 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                {session.user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                            </span>
                            {session.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "Profile"}
                                    width={32}
                                    height={32}
                                    className="rounded-full ring-2 ring-[var(--insurai-surface-container)]"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 ring-2 ring-[var(--insurai-surface-container)]">
                                    <span className="material-symbols-outlined text-xl">account_circle</span>
                                </div>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="flex items-center gap-2 px-4 py-2 primary-gradient text-white rounded-lg font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">login</span>
                            {t("nav.signin")}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
