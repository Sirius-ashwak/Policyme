"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
