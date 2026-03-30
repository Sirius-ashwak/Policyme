"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { VoiceAssistant } from "@/components/VoiceAssistant";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            <Navbar />
            <Sidebar />

            {/* Main Content Canvas */}
            <main className="lg:ml-64 pt-24 pb-16 px-6 md:px-8 max-w-7xl mx-auto relative z-0">
                {children}
            </main>

            {/* Global Voice Assistant */}
            <VoiceAssistant />

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center h-20 px-4 z-50 pb-4">
                <a href="/portal" className="flex flex-col items-center text-blue-600">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-[10px] font-bold mt-1">Home</span>
                </a>
                <a href="/portal/claims" className="flex flex-col items-center text-slate-400">
                    <span className="material-symbols-outlined">description</span>
                    <span className="text-[10px] font-bold mt-1">Claims</span>
                </a>
                <a href="/portal/submit" className="flex flex-col items-center translate-y-[-12px]">
                    <div className="w-12 h-12 primary-gradient rounded-full flex items-center justify-center shadow-lg text-white">
                        <span className="material-symbols-outlined">mic</span>
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-blue-600">AI Voice</span>
                </a>
                <a href="/portal/policy" className="flex flex-col items-center text-slate-400">
                    <span className="material-symbols-outlined">shield</span>
                    <span className="text-[10px] font-bold mt-1">Policies</span>
                </a>
                <a href="/portal/settings" className="flex flex-col items-center text-slate-400">
                    <span className="material-symbols-outlined">account_circle</span>
                    <span className="text-[10px] font-bold mt-1">Profile</span>
                </a>
            </div>
        </div>
    );
}
