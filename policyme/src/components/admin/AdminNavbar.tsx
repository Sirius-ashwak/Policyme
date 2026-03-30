"use client";

import Link from "next/link";

export function AdminNavbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm border-b border-white/10">
            <div className="flex items-center justify-between px-8 h-16 w-full">
                {/* Left Section */}
                <div className="flex items-center gap-8">
                    <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 font-['Manrope']">
                        InsurAI Admin
                    </span>
                    <div className="hidden md:flex items-center bg-slate-200/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full group focus-within:ring-2 ring-primary/20 transition-all">
                        <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                        <input 
                            type="text"
                            placeholder="Search infrastructure..." 
                            className="bg-transparent border-none focus:ring-0 text-sm font-['Manrope'] tracking-tight text-slate-600 dark:text-slate-300 w-64 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-full active:scale-95">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-full active:scale-95">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-full active:scale-95">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                    <div className="h-8 w-px bg-slate-200/50 dark:bg-slate-700/50 mx-2"></div>
                    <div className="relative">
                        <img 
                            alt="Administrator Profile" 
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20 shadow-sm"
                            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&auto=format&fit=crop"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
