"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminNavbar() {
    const handleAction = (action: string) => {
        toast(action, {
            description: "This action is temporarily disabled in the demo environment.",
        });
    };

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
                            className="bg-transparent border-none focus:ring-0 outline-none text-sm font-['Manrope'] tracking-tight text-slate-600 dark:text-slate-300 w-64 placeholder:text-slate-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    toast.loading("Searching knowledge graph...", { duration: 1500 });
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => toast.info("No new alerts", { description: "All systems operational. Mainframe link stable." })}
                            className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-full active:scale-95">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button 
                            onClick={() => handleAction("Opening Global Settings...")}
                            className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-full active:scale-95">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                        <button 
                            onClick={() => handleAction("Loading Help Center...")}
                            className="p-2 text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-full active:scale-95">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                    <div className="h-8 w-px bg-slate-200/50 dark:bg-slate-700/50 mx-2"></div>
                    
                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="relative outline-none cursor-pointer group rounded-full">
                            <img 
                                alt="Administrator Profile" 
                                className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20 shadow-sm group-hover:ring-[var(--primary)] transition-all"
                                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&auto=format&fit=crop"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 font-['Manrope'] p-2">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">System Admin</span>
                                    <span className="text-xs text-muted-foreground font-['Inter']">admin@insurai.io</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction("Navigating to Profile...")} className="cursor-pointer gap-2">
                                <span className="material-symbols-outlined text-[18px]">person</span> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("Opening Security Preferences...")} className="cursor-pointer gap-2">
                                <span className="material-symbols-outlined text-[18px]">shield</span> Security
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success("Connected", { description: "API Key verified." })} className="cursor-pointer gap-2">
                                <span className="material-symbols-outlined text-[18px]">key</span> API Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950">
                                <span className="material-symbols-outlined text-[18px]">logout</span> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
