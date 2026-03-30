"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/dashboard/admin");

    if (isAdmin) {
        return (
            <div className="min-h-screen bg-[var(--insurai-surface)]">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            <Navbar />
            <Sidebar />
            <main className="lg:ml-64 pt-16">
                {children}
            </main>
        </div>
    );
}
