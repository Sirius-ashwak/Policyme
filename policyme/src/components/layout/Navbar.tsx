"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine which top-level section is active
    const isPortal = pathname.startsWith("/portal");
    const isUnderwriter = pathname.startsWith("/dashboard/underwriter") || pathname.includes("/underwriter");
    const isAdjuster = pathname.startsWith("/dashboard/adjuster") || pathname.includes("/adjuster");
    const isManager = pathname.startsWith("/dashboard/manager");
    const isAdmin = pathname.startsWith("/dashboard/admin");

    const roleLinks = [
        { label: t("nav.portal"), href: "/portal", active: isPortal },
        { label: t("nav.underwriter"), href: "/dashboard/underwriter", active: isUnderwriter },
        { label: t("nav.adjuster"), href: "/dashboard/adjuster", active: isAdjuster },
    ];

    // Add Manager/Admin links based on session role
    if (mounted && session?.user?.role === "Manager" || session?.user?.role === "Admin") {
        roleLinks.push({ label: t("nav.manager"), href: "/dashboard/manager", active: isManager });
    }
    if (mounted && session?.user?.role === "Admin") {
        roleLinks.push({ label: t("nav.admin"), href: "/dashboard/admin", active: isAdmin });
    }

    return (
        <header className="fixed top-0 w-full z-50 glass-header shadow-[0_1px_0_0_rgba(0,0,0,0.05)] h-16">
            <div className="flex justify-between items-center h-full px-6 w-full max-w-[1920px] mx-auto font-[Manrope] tracking-tight">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center shadow-md shadow-blue-200/50">
                            <span className="material-symbols-outlined text-white text-xl">shield_with_heart</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">
                            InsurAI
                        </span>
                    </Link>

                    {/* Role Navigation Tabs */}
                    <nav className="hidden md:flex items-center gap-6">
                        {roleLinks.map((link) => (
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
                </div>

                {/* Right Side: Actions + User */}
                <div className="flex items-center gap-3">
                    {/* Native Premium Language Switcher */}
                    {mounted && <LanguageSwitcher />}

                    {/* Notifications */}
                    <button className="p-2 text-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    {/* Settings */}
                    <button className="p-2 text-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200">
                        <span className="material-symbols-outlined">settings</span>
                    </button>

                    {/* User Profile / Auth */}
                    {!mounted || status === "loading" ? (
                        <div className="h-8 w-20 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-full" />
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 p-1 pl-3 bg-slate-100 dark:bg-slate-800 rounded-full border border-[var(--insurai-outline-variant)]/20 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                {session.user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                            </span>
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 ring-2 ring-[var(--insurai-surface-container)]">
                                <span className="material-symbols-outlined text-xl">account_circle</span>
                            </div>
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
