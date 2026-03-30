"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboardPage() {
    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] selection:bg-[var(--primary)]/20 px-6 md:px-10 py-12">
            
            {/* Header Section: High-End Asymmetry */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] mb-2 font-['Manrope']">
                        System Overview
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed">
                        Enterprise intelligence engine monitoring. All semantic layers operational across distributed clusters.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-[var(--insurai-surface-container-low)] p-1.5 rounded-xl">
                    <button className="px-4 py-1.5 bg-[var(--insurai-surface-container-lowest)] shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-lg text-xs font-['Inter'] font-semibold text-[var(--primary)]">
                        LIVE
                    </button>
                    <button className="px-4 py-1.5 text-xs font-['Inter'] font-medium text-[var(--insurai-on-surface-variant)]">
                        HISTORICAL
                    </button>
                </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Section 1: System Health (Monitoring) */}
                <section className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Neo4j Status */}
                    <div className="col-span-1 bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-[var(--primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                hub
                            </span>
                            <span className="text-[10px] font-['Inter'] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Healthy
                            </span>
                        </div>
                        <p className="text-[var(--insurai-on-surface-variant)] text-xs font-['Inter'] uppercase tracking-widest mb-1">
                            Neo4j Status
                        </p>
                        <h3 className="text-2xl font-bold font-['Manrope']">
                            99.98<span className="text-sm font-normal text-[var(--insurai-on-surface-variant)] ml-1">%</span>
                        </h3>
                        <div className="mt-4 h-1 w-full bg-[var(--insurai-surface-container-low)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] w-[99%]"></div>
                        </div>
                    </div>

                    {/* API Latency */}
                    <div className="col-span-1 bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-[var(--primary)]">timer</span>
                            <span className="text-[10px] font-['Inter'] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Nominal
                            </span>
                        </div>
                        <p className="text-[var(--insurai-on-surface-variant)] text-xs font-['Inter'] uppercase tracking-widest mb-1">
                            API Latency
                        </p>
                        <h3 className="text-2xl font-bold font-['Manrope']">
                            124<span className="text-sm font-normal text-[var(--insurai-on-surface-variant)] ml-1">ms</span>
                        </h3>
                        <div className="mt-4 flex gap-[2px] items-end h-6">
                            <div className="w-1 bg-[var(--primary)]/20 h-2 rounded-full"></div>
                            <div className="w-1 bg-[var(--primary)]/20 h-3 rounded-full"></div>
                            <div className="w-1 bg-[var(--primary)]/40 h-4 rounded-full"></div>
                            <div className="w-1 bg-[var(--primary)]/60 h-5 rounded-full"></div>
                            <div className="w-1 bg-[var(--primary)] h-6 rounded-full"></div>
                            <div className="w-1 bg-[var(--primary)]/80 h-4 rounded-full"></div>
                        </div>
                    </div>

                    {/* LLM Tokens */}
                    <div className="col-span-1 bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="material-symbols-outlined text-[var(--primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                generating_tokens
                            </span>
                            <span className="text-[10px] font-['Inter'] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Active
                            </span>
                        </div>
                        <p className="text-[var(--insurai-on-surface-variant)] text-xs font-['Inter'] uppercase tracking-widest mb-1">
                            LLM Tokens
                        </p>
                        <h3 className="text-2xl font-bold font-['Manrope']">
                            1.2M<span className="text-sm font-normal text-[var(--insurai-on-surface-variant)] ml-1">/hr</span>
                        </h3>
                        <div className="mt-4 h-1 w-full bg-[var(--insurai-surface-container-low)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--primary)] w-[65%]"></div>
                        </div>
                    </div>

                    {/* AI Performance Trend: Large Featured Card */}
                    <div className="col-span-1 md:col-span-3 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)] relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                <div>
                                    <p className="text-xs font-['Inter'] uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-1">
                                        AI Performance Trend
                                    </p>
                                    <h2 className="text-3xl font-extrabold font-['Manrope']">Precision Metrics</h2>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">Avg Match Confidence</p>
                                        <p className="text-xl font-bold text-[var(--primary)]">98.4%</p>
                                    </div>
                                    <div className="text-right border-l border-[var(--insurai-outline-variant)]/30 pl-8">
                                        <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-tighter">Human Override Rate</p>
                                        <p className="text-xl font-bold text-[var(--insurai-on-surface)]">1.2%</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mock Chart Representation using Tailwind heights */}
                            <div className="h-48 w-full flex items-end gap-2">
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[40%] hover:h-[45%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent opacity-20 h-full rounded-t-lg"></div>
                                </div>
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[55%] hover:h-[60%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent opacity-30 h-full rounded-t-lg"></div>
                                </div>
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[48%] hover:h-[53%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent opacity-25 h-full rounded-t-lg"></div>
                                </div>
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[72%] hover:h-[77%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent opacity-50 h-full rounded-t-lg"></div>
                                </div>
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[68%] hover:h-[73%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent opacity-45 h-full rounded-t-lg"></div>
                                </div>
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[85%] hover:h-[90%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] opacity-90 h-full rounded-t-lg"></div>
                                </div>
                                <div className="flex-1 bg-[var(--insurai-surface-container-low)] rounded-t-lg relative group h-[78%] hover:h-[83%] transition-all duration-300">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary)] to-transparent opacity-60 h-full rounded-t-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Active Users & Knowledge Graph (Right Column) */}
                <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Active Users */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <h4 className="font-['Manrope'] font-bold text-sm mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">group</span>
                            Active System Presence
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[var(--insurai-outline-variant)]/10">
                                        <span className="material-symbols-outlined text-sm text-[var(--primary)]">person</span>
                                    </div>
                                    <span className="text-sm font-semibold">Customers</span>
                                </div>
                                <span className="text-sm font-bold">14,282</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[var(--insurai-outline-variant)]/10">
                                        <span className="material-symbols-outlined text-sm text-[var(--primary)]">verified_user</span>
                                    </div>
                                    <span className="text-sm font-semibold">Underwriters</span>
                                </div>
                                <span className="text-sm font-bold">842</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[var(--insurai-outline-variant)]/10">
                                        <span className="material-symbols-outlined text-sm text-[var(--primary)]">gavel</span>
                                    </div>
                                    <span className="text-sm font-semibold">Adjusters</span>
                                </div>
                                <span className="text-sm font-bold">312</span>
                            </div>
                        </div>
                    </div>

                    {/* Knowledge Graph Progress */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-['Manrope'] font-bold text-sm">Knowledge Graph</h4>
                            <span className="material-symbols-outlined text-[var(--primary)] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-['Inter'] text-[var(--insurai-on-surface-variant)]">Policy Ingestion</p>
                                <p className="text-xs font-bold text-[var(--primary)]">65%</p>
                            </div>
                            <div className="h-2 w-full bg-[var(--insurai-surface-container-low)] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--insurai-primary-container)] w-[65%] rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-[11px] text-[var(--insurai-on-surface-variant)] leading-tight">
                            Scanning 45 new policies for semantic alignment and relationship mapping in Neo4j production cluster.
                        </p>
                    </div>

                    {/* Global Audit Log: Concise List */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)] flex-1">
                        <h4 className="font-['Manrope'] font-bold text-sm mb-6">Global Audit Log</h4>
                        <div className="space-y-6">
                            
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5"></div>
                                    <div className="absolute top-4 left-[3px] w-[2px] h-10 bg-[var(--insurai-outline-variant)]/20"></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Risk thresholds updated</p>
                                    <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] mt-0.5">Admin • 12m ago</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-[var(--insurai-outline-variant)] mt-1.5"></div>
                                    <div className="absolute top-4 left-[3px] w-[2px] h-10 bg-[var(--insurai-outline-variant)]/20"></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Policy Graph v4.2 deployed</p>
                                    <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] mt-0.5">System • 45m ago</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-[var(--insurai-outline-variant)] mt-1.5"></div>
                                    <div className="absolute top-4 left-[3px] w-[2px] h-10 bg-[var(--insurai-outline-variant)]/20"></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">LLM Token limit increased</p>
                                    <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] mt-0.5">Ops • 2h ago</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-[var(--insurai-outline-variant)] mt-1.5"></div>
                                <div>
                                    <p className="text-xs font-bold">New tenant: Acme Global</p>
                                    <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] mt-0.5">System • 5h ago</p>
                                </div>
                            </div>
                            
                        </div>
                        <button className="w-full mt-8 py-2 text-xs font-['Inter'] font-bold text-[var(--primary)] border border-[var(--primary)]/10 rounded-lg hover:bg-[var(--primary)]/5 transition-colors">
                            VIEW FULL LOGS
                        </button>
                    </div>

                </section>
            </div>

            {/* Footer / Technical Specs */}
            <footer className="mt-16 pt-8 border-t border-[var(--insurai-outline-variant)]/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest">Mainframe Link: Established</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest">Version 2.4.0-Stable</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <img 
                        alt="Infrastructure server racks representation" 
                        className="h-6 opacity-20 grayscale dark:invert" 
                        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=200&auto=format&fit=crop"
                    />
                </div>
            </footer>

            {/* Floating Action for Quick Alert (Right bottom absolute) */}
            <div className="fixed bottom-8 right-8 z-[60]">
                <button className="group bg-[var(--insurai-on-surface)] text-[var(--insurai-surface)] p-4 rounded-full shadow-2xl flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">bolt</span>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-sm px-0 group-hover:px-2">
                        QUICK ACTIONS
                    </span>
                </button>
            </div>

        </div>
    );
}
