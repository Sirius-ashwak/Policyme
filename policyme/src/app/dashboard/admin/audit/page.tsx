"use client";

import Link from "next/link";
import { useState } from "react";

export default function AuditLogsPage() {
    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">
                        System Audit Logs
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed max-w-xl">
                        Immutable ledger of all administrative actions, AI overrides, and authentication events for rigorous compliance monitoring.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[var(--insurai-surface-container-lowest)] p-1 rounded-xl shadow-sm border border-[var(--insurai-outline-variant)]/10">
                        <div className="bg-[var(--insurai-surface-container-low)] rounded-lg px-3 py-1.5 flex items-center gap-2 border border-[var(--insurai-outline-variant)]/5">
                            <span className="material-symbols-outlined text-[16px] text-[var(--insurai-on-surface-variant)]">search</span>
                            <input 
                                type="text"
                                placeholder="Search event hash or ID..."
                                className="bg-transparent border-none text-xs w-48 focus:ring-0 p-0 text-[var(--insurai-on-surface)] font-['Inter'] placeholder:text-[var(--insurai-on-surface-variant)]"
                            />
                        </div>
                        <button className="px-3 py-1.5 text-xs font-bold text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] hover:bg-[var(--insurai-surface-container-low)] rounded-lg transition-colors flex items-center gap-1 font-['Inter']">
                            <span className="material-symbols-outlined text-[14px]">filter_list</span>
                            Filter
                        </button>
                    </div>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--insurai-on-surface)] text-[var(--insurai-surface)] hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center gap-2 font-['Inter']">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4 hover:border-blue-500/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined">security</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-0.5">Auth Events</p>
                        <p className="text-xl font-bold font-['Manrope'] text-[var(--insurai-on-surface)]">12,402</p>
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4 hover:border-[var(--primary)]/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                        <span className="material-symbols-outlined">hub</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-0.5">Graph Writes</p>
                        <p className="text-xl font-bold font-['Manrope'] text-[var(--insurai-on-surface)]">3,812</p>
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center gap-4 hover:border-amber-500/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-0.5">Overrides</p>
                        <p className="text-xl font-bold font-['Manrope'] text-[var(--insurai-on-surface)]">402</p>
                    </div>
                </div>

                <div className="bg-[var(--insurai-surface-container-lowest)] p-4 rounded-xl border-2 border-red-500/20 shadow-[0_4px_12px_rgba(239,68,68,0.05)] flex items-center gap-4 hover:border-red-500/40 transition-all cursor-pointer relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 relative z-10">
                        <span className="material-symbols-outlined">gpp_bad</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-['Inter'] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                            Anomalies <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        </p>
                        <p className="text-xl font-bold font-['Manrope'] text-red-700 dark:text-red-300">14</p>
                    </div>
                </div>
            </div>

            {/* Main Log Table */}
            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-4 border-b border-[var(--insurai-surface-container-high)] flex items-center justify-between bg-[var(--insurai-surface-container-low)]/50">
                    <h3 className="text-sm font-bold font-['Manrope'] text-[var(--insurai-on-surface)]">Unified Compliance Ledger</h3>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 text-[10px] font-bold uppercase text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] font-['Inter'] tracking-wider bg-white dark:bg-slate-800 rounded shadow-sm border border-[var(--insurai-outline-variant)]/20">All Sources</button>
                        <button className="px-2 py-1 text-[10px] font-bold uppercase text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] font-['Inter'] tracking-wider rounded border border-transparent">System Admin</button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-['Inter']">
                        <thead className="bg-[#f8f9fc] dark:bg-slate-900/50 border-b border-[var(--insurai-outline-variant)]/5">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] w-12">Seq</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Actor</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)]">Event Hash / Action</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--insurai-surface-container-highest)]/30 text-sm">
                            
                            {/* Critical Row Example */}
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group relative border-l-2 border-l-red-500 bg-red-50/10 dark:bg-red-900/5">
                                <td className="px-6 py-4 font-mono text-[10px] text-[var(--insurai-on-surface-variant)] font-semibold">49201</td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-xs text-[var(--insurai-on-surface)] block">Today, 14:02:11</span>
                                    <span className="text-[10px] text-[var(--insurai-on-surface-variant)]">UTC-5</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 flex items-center justify-center font-bold text-[10px]">MJ</div>
                                        <div>
                                            <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">System Account</p>
                                            <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5">172.16.25.12</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">Multiple failed MFA attempts</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5 tracking-wider truncate max-w-[250px]">0x7b4a...92cf1a</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
                                        Blocked
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-[var(--primary)]/20 transition-colors whitespace-nowrap opacity-0 group-hover:opacity-100">
                                        INVESTIGATE
                                    </button>
                                </td>
                            </tr>

                            {/* Normal Row Example */}
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-[10px] text-[var(--insurai-on-surface-variant)] font-semibold">49200</td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-xs text-[var(--insurai-on-surface)] block">Today, 13:45:22</span>
                                    <span className="text-[10px] text-[var(--insurai-on-surface-variant)]">UTC-5</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-[10px]">
                                            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">GraphRAG Engine</p>
                                            <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5">internal-cluster</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">Commit Vector Embeddings (Batch #442)</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5 tracking-wider truncate max-w-[250px]">0x2f8c...331e8b</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-slate-500">
                                        <span className="material-symbols-outlined text-[12px]">check</span>
                                        Success
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] p-1.5 rounded-md text-[10px] font-bold hover:bg-[var(--insurai-surface-container-high)] transition-colors opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    </button>
                                </td>
                            </tr>
                            
                            {/* Normal Row Example */}
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-[10px] text-[var(--insurai-on-surface-variant)] font-semibold">49199</td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-xs text-[var(--insurai-on-surface)] block">Today, 11:20:05</span>
                                    <span className="text-[10px] text-[var(--insurai-on-surface-variant)]">UTC-5</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-[var(--insurai-primary-fixed)] dark:bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center font-bold text-[10px]">SC</div>
                                        <div>
                                            <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">Sarah Chen</p>
                                            <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5">192.168.1.104</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-xs text-[var(--insurai-on-surface)]">Force LLM Override (Claim #9822)</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-mono mt-0.5 tracking-wider truncate max-w-[250px]">0xa11f...45dd90</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                                        Recorded
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] p-1.5 rounded-md text-[10px] font-bold hover:bg-[var(--insurai-surface-container-high)] transition-colors opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    </button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[var(--insurai-surface-container-high)] bg-[var(--insurai-surface-container-lowest)]">
                    <p className="text-[11px] font-['Inter'] font-semibold text-[var(--insurai-on-surface-variant)]">
                        Displaying <span className="font-bold text-[var(--insurai-on-surface)]">1</span> to <span className="font-bold text-[var(--insurai-on-surface)]">3</span> of <span className="font-bold text-[var(--insurai-on-surface)]">49,201</span> entries
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container-low)] text-xs font-bold text-[var(--insurai-on-surface-variant)] transition-colors">Previous</button>
                        <button className="px-3 py-1.5 rounded-lg border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container-low)] text-xs font-bold text-[var(--insurai-on-surface)] transition-colors">Next</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
