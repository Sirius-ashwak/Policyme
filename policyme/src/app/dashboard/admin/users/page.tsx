"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function UserRoleManagementPage() {
    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12 pb-20">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] font-['Manrope']">
                        User & Role Management
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] max-w-lg leading-relaxed">
                        Orchestrate platform access and governance. Manage permissions for underwriters, adjusters, and customer entities.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => toast.promise(new Promise(r => setTimeout(r, 1500)), {
                            loading: "Generating user export...",
                            success: `Exported user_roles_${new Date().toISOString().split('T')[0]}.csv`,
                            error: "Export failed"
                        })}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container-low)] transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export CSV
                    </button>
                    <button onClick={() => toast("Opening User Creation Wizard", { description: "Identity provider connection initializing..." })} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--insurai-primary-container)] transition-all flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Add User
                    </button>
                </div>
            </div>

            {/* Bento Grid - Stats & Utilization */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
                
                {/* License Utilization Card */}
                <div className="md:col-span-8 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(26,27,31,0.02)]">
                    <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--primary)] opacity-80 font-['Inter']">
                                System Analytics
                            </span>
                            <h3 className="text-2xl font-bold font-['Manrope']">Total License Utilization</h3>
                        </div>
                        <div className="text-left md:text-right">
                            <span className="text-4xl font-black text-[var(--primary)] font-['Manrope']">84%</span>
                            <p className="text-xs text-[var(--insurai-on-surface-variant)] font-medium font-['Inter']">
                                840 / 1000 Seats
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-8 space-y-4">
                        <div className="w-full bg-[var(--insurai-surface-container-highest)]/40 h-3 rounded-full overflow-hidden flex">
                            <div className="h-full bg-[var(--primary)] w-[45%] border-r border-white/10" title="Customer"></div>
                            <div className="h-full bg-blue-400 dark:bg-blue-500 w-[25%] border-r border-white/10" title="Underwriter"></div>
                            <div className="h-full bg-amber-500 dark:bg-amber-600 w-[14%] border-r border-white/10" title="Adjuster"></div>
                        </div>
                        <div className="flex flex-wrap gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[var(--primary)] border border-white/20"></span>
                                <span className="text-xs font-semibold text-[var(--insurai-on-surface-variant)]">Customers (450)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-400 dark:bg-blue-500 border border-white/20"></span>
                                <span className="text-xs font-semibold text-[var(--insurai-on-surface-variant)]">Underwriters (250)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-600 border border-white/20"></span>
                                <span className="text-xs font-semibold text-[var(--insurai-on-surface-variant)]">Adjusters (140)</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                </div>

                {/* Secondary Meta Cards */}
                <div className="md:col-span-4 grid grid-rows-2 gap-6">
                    <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl flex items-center justify-between shadow-sm hover:border-amber-500/30 transition-colors">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wide font-['Inter']">
                                Pending MFA
                            </p>
                            <p className="text-3xl font-black text-amber-600 dark:text-amber-500 font-['Manrope']">
                                12
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center border border-amber-100 dark:border-amber-800">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-500">lock_reset</span>
                        </div>
                    </div>
                    
                    <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl flex items-center justify-between shadow-sm hover:border-[var(--primary)]/30 transition-colors">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wide font-['Inter']">
                                Active Sessions
                            </p>
                            <p className="text-3xl font-black text-[var(--primary)] font-['Manrope']">
                                312
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                            <span className="material-symbols-outlined text-[var(--primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                    </div>
                </div>
                
            </div>

            {/* High-Density Data Table Section */}
            <div className="bg-[var(--insurai-surface-container-lowest)] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10">
                <div className="p-6 flex items-center justify-between border-b border-[var(--insurai-surface-container-high)]">
                    <h3 className="text-lg font-bold font-['Manrope']">Platform Personnel</h3>
                    <div className="flex gap-2">
                        <button className="p-2 border border-[var(--insurai-outline-variant)]/10 rounded-lg hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                            <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-[20px]">filter_list</span>
                        </button>
                        <button className="p-2 border border-[var(--insurai-outline-variant)]/10 rounded-lg hover:bg-[var(--insurai-surface-container-low)] transition-colors">
                            <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-[20px]">more_vert</span>
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--insurai-surface-container-low)]/50 border-b border-[var(--insurai-outline-variant)]/10">
                                <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-xs font-semibold">User Identity</th>
                                <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-xs font-semibold">System Role</th>
                                <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-xs font-semibold">Status</th>
                                <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-xs font-semibold">Last Activity</th>
                                <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-xs font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--insurai-surface-container-high)]/50">
                            
                            {/* Row 1 */}
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[var(--insurai-primary-fixed)] dark:bg-[var(--primary)]/20 flex items-center justify-center font-bold text-[var(--primary)] text-sm shadow-inner">
                                            SC
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">Sarah Chen</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] font-['Inter']">sarah.chen@insurai.io</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-['Inter'] border border-blue-200 dark:border-blue-800">
                                        Underwriter
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-['Inter']">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]"></span>
                                        Active
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)] font-medium font-['Inter']">Just now</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-['Inter'] tracking-wider mt-0.5">192.168.1.104</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.success("Access Granted", { description: "Session unlocked for Sarah Chen" })} className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 transition-colors font-['Inter']">
                                        Manage
                                    </button>
                                </td>
                            </tr>

                            {/* Row 2 */}
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-700 dark:text-amber-500 text-sm shadow-inner">
                                            MJ
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">Marcus Jordan</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] font-['Inter']">m.jordan@claims.net</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--insurai-surface-container-highest)] text-[var(--insurai-on-surface-variant)] font-['Inter'] border border-[var(--insurai-outline-variant)]/20">
                                        Adjuster
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 font-['Inter']">
                                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                        Pending MFA
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)] font-medium font-['Inter']">2 hours ago</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-['Inter'] tracking-wider mt-0.5">172.16.25.12</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast("MFA Prompt Sent", { description: "Resent MFA unlock link to m.jordan@claims.net" })} className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 transition-colors font-['Inter']">
                                        Manage
                                    </button>
                                </td>
                            </tr>

                            {/* Row 3 - Image Avatar */}
                            <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            alt="Elena Rodriguez" 
                                            className="h-10 w-10 rounded-full object-cover shadow-sm border border-[var(--insurai-outline-variant)]/20" 
                                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&auto=format&fit=crop"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">Elena Rodriguez</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] font-['Inter']">elena.rod@global-inc.com</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--insurai-primary-fixed)] dark:bg-[var(--primary)]/30 text-[var(--primary)] font-['Inter'] border border-[var(--insurai-primary-fixed-dim)]/50">
                                        Customer
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-['Inter']">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Active
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)] font-medium font-['Inter']">Dec 14, 10:45 AM</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-['Inter'] tracking-wider mt-0.5">45.22.10.221</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast("Viewing Profile", { description: "Loading customer policy records..." })} className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 transition-colors font-['Inter']">
                                        Manage
                                    </button>
                                </td>
                            </tr>

                            {/* Row 4 - Suspended */}
                            <tr className="hover:bg-red-50/20 dark:hover:bg-red-900/10 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-sm shadow-inner">
                                            DK
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">David Kim</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)] font-['Inter']">dkim_02@temp.com</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--insurai-surface-container-highest)] text-[var(--insurai-on-surface-variant)] font-['Inter'] border border-[var(--insurai-outline-variant)]/20">
                                        Adjuster
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 font-['Inter']">
                                        <span className="material-symbols-outlined text-[14px]">block</span>
                                        Suspended
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs text-[var(--insurai-on-surface-variant)] font-medium font-['Inter']">Nov 28, 09:12 AM</p>
                                    <p className="text-[10px] text-[var(--insurai-outline)] font-['Inter'] tracking-wider mt-0.5">82.112.5.44</p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => toast.error("Account Suspended", { description: "This account cannot be managed until unlocked by a super admin." })} className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 transition-colors font-['Inter']">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[var(--insurai-surface-container-high)] bg-[var(--insurai-surface-container-lowest)]">
                    <p className="text-xs font-['Inter'] font-medium text-[var(--insurai-on-surface-variant)]">
                        Showing <span className="font-bold text-[var(--insurai-on-surface)]">4</span> of <span className="font-bold text-[var(--insurai-on-surface)]">840</span> users
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-[var(--insurai-surface-container-low)] text-[var(--insurai-on-surface-variant)] disabled:opacity-30 disabled:hover:bg-transparent" disabled>
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button className="px-3 py-1.5 rounded bg-[var(--primary)] text-white text-xs font-bold shadow-sm">1</button>
                        <button className="px-3 py-1.5 rounded hover:bg-[var(--insurai-surface-container-low)] text-xs font-bold text-[var(--insurai-on-surface-variant)] transition-colors">2</button>
                        <button className="px-3 py-1.5 rounded hover:bg-[var(--insurai-surface-container-low)] text-xs font-bold text-[var(--insurai-on-surface-variant)] transition-colors">3</button>
                        <span className="px-2 text-[var(--insurai-on-surface-variant)] text-xs">...</span>
                        <button className="px-3 py-1.5 rounded hover:bg-[var(--insurai-surface-container-low)] text-xs font-bold text-[var(--insurai-on-surface-variant)] transition-colors">42</button>
                        <button className="p-1 rounded hover:bg-[var(--insurai-surface-container-low)] text-[var(--insurai-on-surface-variant)] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Permission Tipping Section (Small Callout) */}
            <div className="mt-8 bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-[var(--primary)]/20 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
                
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-[var(--insurai-outline-variant)]/20 flex items-center justify-center shrink-0 relative z-10">
                    <span className="material-symbols-outlined text-[var(--primary)] text-[28px]">security_update_good</span>
                </div>
                
                <div className="space-y-1 text-center md:text-left relative z-10">
                    <h4 className="text-lg font-bold font-['Manrope']">Smart Role Recommendations</h4>
                    <p className="text-sm font-['Inter'] text-[var(--insurai-on-surface-variant)] leading-relaxed max-w-2xl">
                        InsurAI has detected 4 users with administrative actions who are currently assigned as 'Underwriter'. 
                        Consider reviewing their permission levels to maintain security compliance.
                    </p>
                </div>
                
                <button 
                    onClick={() => toast.promise(new Promise(r => setTimeout(r, 2000)), {
                        loading: "Analyzing permission graph...",
                        success: "Anomaly report generated. 4 users flagged.",
                        error: "Analysis failed"
                    })}
                    className="md:ml-auto px-6 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold text-[var(--primary)] border border-[var(--primary)]/30 dark:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 dark:hover:bg-[var(--primary)]/10 transition-all shadow-sm font-['Inter'] whitespace-nowrap relative z-10 hover:shadow-md hover:-translate-y-0.5"
                >
                    Review Anomalies
                </button>
            </div>

        </div>
    );
}
