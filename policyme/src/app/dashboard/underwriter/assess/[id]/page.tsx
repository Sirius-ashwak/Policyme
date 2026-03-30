"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RiskAssessorPage() {
    return (
        <div className="pt-8 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto animate-fade-in font-['Manrope']">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-sm font-['Inter'] text-[var(--insurai-on-surface-variant)] opacity-80 mb-2">
                        <Link href="/dashboard/underwriter">Assessments</Link>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span>Commercial Property</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-1 text-[var(--insurai-on-surface)]">APP-94281: Meridian Plaza</h1>
                    <p className="text-[var(--insurai-on-surface-variant)] font-medium text-sm">Submission Date: Oct 24, 2023 • Applicant: Sterling Real Estate Holdings</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-[var(--insurai-outline-variant)]/30 font-semibold text-sm hover:bg-[var(--insurai-surface-container-low)] transition-colors active:scale-95">
                        Flag Review
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--insurai-primary-container)] text-white font-semibold text-sm shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Edit Application
                    </button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Left Column: Risk Score & Summary */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    
                    {/* AI Confidence Score Card */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <span className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-6">AI Confidence Score</span>
                        
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                                <circle className="text-[var(--insurai-surface-container-high)]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                                <circle className="text-[var(--primary)]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset="82.93" strokeWidth="12" strokeLinecap="round"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-extrabold">85</span>
                                <span className="font-['Inter'] text-sm font-medium text-[var(--insurai-on-surface-variant)]/60">/ 100</span>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">High Confidence</span>
                        </div>
                        <p className="mt-4 text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                            Analysis based on 42 historical data points and current market volatility metrics.
                        </p>
                    </div>

                    {/* Rapid Details */}
                    <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--insurai-on-surface)]">Entity Profile</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Asset Value</span>
                                <span className="text-sm font-bold">$14.2M</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Occupancy Rate</span>
                                <span className="text-sm font-bold">94%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Years in Portfolio</span>
                                <span className="text-sm font-bold">8 Years</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[var(--insurai-on-surface-variant)]">Claims History</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Low (1)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Insights & Recommendations */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    
                    {/* Main Insights Section */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-8 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">Risk Factors Analysis</h2>
                            <button className="text-[var(--primary)] text-sm font-semibold flex items-center gap-1 hover:underline">
                                View Full Report <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Factor 1 */}
                            <div className="p-5 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 mt-1">verified</span>
                                    <div>
                                        <h4 className="font-bold text-[var(--insurai-on-surface)] mb-1">Modernized Fire Suppression</h4>
                                        <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                            System upgrade completed in Q3 2023. Reduces fire-related risk variance by 32% compared to regional baseline.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Factor 2 */}
                            <div className="p-5 rounded-lg border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-1">warning</span>
                                    <div>
                                        <h4 className="font-bold text-[var(--insurai-on-surface)] mb-1">Geographic Exposure</h4>
                                        <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                            Asset is within a secondary flood zone. Recommended additional structural validation for basement levels.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Factor 3 */}
                            <div className="p-5 rounded-lg border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-1">info</span>
                                    <div>
                                        <h4 className="font-bold text-[var(--insurai-on-surface)] mb-1">Tenant Credit Mix</h4>
                                        <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                                            Current tenant roster features 80% investment-grade companies. Provides significant stability to rental income coverage.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendation & Action Bar */}
                    <div className="bg-[var(--primary)] p-8 rounded-xl text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Automated Recommendation</h3>
                                <p className="text-white/80 text-sm max-w-lg leading-relaxed">
                                    The AI Assessor recommends <strong className="text-white font-bold">Approval</strong> with a standard premium adjustment of -4.2% based on enhanced safety compliance.
                                </p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20">
                                    Reject
                                </button>
                                <button className="flex-1 md:flex-none px-8 py-3 rounded-lg bg-white text-[var(--primary)] font-bold shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                                    Approve Policy
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50 pointer-events-none" />
                    </div>

                    {/* Supporting Documentation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-[var(--insurai-surface-container-high)] transition-colors">
                            <div className="h-12 w-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[var(--primary)] shadow-sm">
                                <span className="material-symbols-outlined">photo_library</span>
                            </div>
                            <div>
                                <h5 className="font-bold text-sm text-[var(--insurai-on-surface)]">Site Survey Photos</h5>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">12 Files • Uploaded 2d ago</p>
                            </div>
                            <span className="material-symbols-outlined ml-auto text-[var(--insurai-on-surface-variant)]/40 group-hover:text-[var(--primary)] transition-colors">download</span>
                        </div>
                        
                        <div className="bg-[var(--insurai-surface-container-low)] border border-[var(--insurai-outline-variant)]/10 p-6 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-[var(--insurai-surface-container-high)] transition-colors">
                            <div className="h-12 w-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[var(--primary)] shadow-sm">
                                <span className="material-symbols-outlined">summarize</span>
                            </div>
                            <div>
                                <h5 className="font-bold text-sm text-[var(--insurai-on-surface)]">Financial Audit 2023</h5>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)]">PDF • 4.2 MB</p>
                            </div>
                            <span className="material-symbols-outlined ml-auto text-[var(--insurai-on-surface-variant)]/40 group-hover:text-[var(--primary)] transition-colors">download</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="mt-12">
                <div className="bg-[var(--insurai-surface-container-lowest)] border border-[var(--insurai-outline-variant)]/10 p-8 rounded-xl overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="text-xl font-bold text-[var(--insurai-on-surface)]">Location Context</h2>
                        <span className="text-sm font-medium text-[var(--insurai-on-surface-variant)]">452 Meridian Avenue, San Francisco, CA</span>
                    </div>
                    
                    <div className="h-[300px] w-full bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative group">
                        <img 
                            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                            alt="Detailed aerial street map view of an urban financial district" 
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                                <div className="w-4 h-4 bg-[var(--primary)] rounded-full animate-ping opacity-75 absolute"></div>
                                <div className="w-4 h-4 bg-[var(--primary)] rounded-full border-2 border-white relative z-10 shadow-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
