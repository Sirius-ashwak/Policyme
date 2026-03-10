"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, FileText, PlusCircle, ClipboardList, User, LogOut } from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { label: "My Claims", href: "/portal", icon: ClipboardList },
        { label: "File a Claim", href: "/portal/submit", icon: PlusCircle },
        { label: "My Policy", href: "/portal/policy", icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/portal" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-slate-900">PolicyMe</span>
                                <span className="text-xs text-slate-500 block -mt-1 font-medium">Customer Portal</span>
                            </div>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                ? "text-blue-700 bg-blue-50"
                                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="portal-nav-indicator"
                                                className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                    <User className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">John Doe</span>
                            </div>
                            <Link href="/" className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title="Back to main site">
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isActive ? "text-blue-600" : "text-slate-400"
                                    }`}>
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Page Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                {children}
            </main>
        </div>
    );
}
