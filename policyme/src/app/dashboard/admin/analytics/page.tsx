"use client";

import Link from "next/link";
import { useState } from "react";

export default function AIAnalyticsPage() {
    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)]">
                        AI Performance Analytics
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] leading-relaxed max-w-xl">
                        Monitor large language model precision, hallucination risks, and human-in-the-loop intervention metrics across the claim adjudication engine.
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="bg-[var(--insurai-surface-container-low)] p-1 rounded-xl flex shadow-sm border border-[var(--insurai-outline-variant)]/10">
                        <button className="px-4 py-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-[var(--insurai-on-surface)] shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-[var(--insurai-outline-variant)]/20 transition-all font-['Inter']">24H</button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors font-['Inter']">7D</button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors font-['Inter']">30D</button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors font-['Inter'] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            Custom
                        </button>
                    </div>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                
                {/* Primary Metric - Match Confidence */}
                <div className="md:col-span-8 bg-[var(--insurai-surface-container-lowest)] rounded-2xl p-8 border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="textxs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest mb-1 items-center flex gap-2">
                                    <span className="material-symbols-outlined text-[var(--primary)] text-[16px]">target</span>
                                    Average Match Confidence
                                </p>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-5xl font-black tracking-tight font-['Manrope'] text-[var(--insurai-on-surface)]">
                                        94.2<span className="text-2xl text-[var(--insurai-on-surface-variant)] font-semibold">%</span>
                                    </h2>
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md font-['Inter']">
                                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                        +1.4%
                                    </span>
                                </div>
                            </div>
                            
                            {/* Model Selector */}
                            <div className="flex items-center gap-2 bg-[var(--insurai-surface-container-low)] px-3 py-1.5 rounded-lg border border-[var(--insurai-outline-variant)]/10 cursor-pointer hover:bg-[var(--insurai-surface-container)] transition-colors">
                                <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                                <span className="text-xs font-bold text-[var(--insurai-on-surface-variant)] font-['Inter']">Gemini-Pro-2.0</span>
                                <span className="material-symbols-outlined text-[16px] text-[var(--insurai-on-surface-variant)]">expand_more</span>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="mt-12 h-32 w-full relative">
                            {/* Decorative GridLines */}
                            <div className="absolute inset-0 flex flex-col justify-between pt-2 pointer-events-none">
                                <div className="border-t border-[var(--insurai-outline-variant)]/5 w-full"></div>
                                <div className="border-t border-[var(--insurai-outline-variant)]/5 w-full"></div>
                                <div className="border-t border-[var(--insurai-surface-container-highest)] w-full"></div>
                            </div>
                            
                            {/* SVG Line Graph */}
                            <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 800 120" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gradient-confidence" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4"></stop>
                                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,80 Q50,90 100,50 T300,70 T500,30 T700,40 T800,20 L800,120 L0,120 Z" fill="url(#gradient-confidence)" className="transition-all duration-1000 ease-in-out"></path>
                                <path d="M0,80 Q50,90 100,50 T300,70 T500,30 T700,40 T800,20" fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_4px_12px_rgba(0,82,209,0.5)]"></path>
                                {/* Data Points */}
                                <circle cx="100" cy="50" r="5" fill="var(--insurai-surface)" stroke="var(--primary)" strokeWidth="3" className="hover:r-7 transition-all cursor-pointer shadow-lg"></circle>
                                <circle cx="300" cy="70" r="5" fill="var(--insurai-surface)" stroke="var(--primary)" strokeWidth="3" className="hover:r-7 transition-all cursor-pointer shadow-lg"></circle>
                                <circle cx="500" cy="30" r="5" fill="var(--insurai-surface)" stroke="var(--primary)" strokeWidth="3" className="hover:r-7 transition-all cursor-pointer shadow-lg"></circle>
                                <circle cx="700" cy="40" r="5" fill="var(--insurai-surface)" stroke="var(--primary)" strokeWidth="3" className="hover:r-7 transition-all cursor-pointer shadow-lg"></circle>
                                <circle cx="800" cy="20" r="5" fill="white" stroke="var(--primary)" strokeWidth="4" className="shadow-[0_0_15px_rgba(0,82,209,0.8)]"></circle>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Secondary KPIs */}
                <div className="md:col-span-4 grid grid-rows-2 gap-6">
                    {/* HITL Rate */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:border-amber-500/30 transition-colors flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                                Human-in-the-Loop
                            </p>
                            <span className="material-symbols-outlined text-amber-500">warning</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-black font-['Manrope'] text-[var(--insurai-on-surface)]">
                                12.8<span className="text-xl text-[var(--insurai-on-surface-variant)] font-semibold">%</span>
                            </h3>
                        </div>
                        <p className="text-[11px] text-[var(--insurai-on-surface-variant)] font-['Inter'] mt-2">
                            Of all AI adjudications required an underwriter override this week.
                        </p>
                    </div>

                    {/* Processing Time */}
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:border-emerald-500/30 transition-colors flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">speed</span>
                                Retrieval Speed
                            </p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-black font-['Manrope'] text-[var(--insurai-on-surface)]">
                                240<span className="text-xl text-[var(--insurai-on-surface-variant)] font-semibold">ms</span>
                            </h3>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded font-['Inter']">
                                <span className="material-symbols-outlined text-[12px]">trending_down</span>
                                -14ms
                            </span>
                        </div>
                        <div className="mt-3 w-full h-1.5 bg-[var(--insurai-surface-container-high)] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full w-[85%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Tables and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Hallucination Risks Data Table */}
                <div className="md:col-span-8 bg-[var(--insurai-surface-container-lowest)] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--insurai-surface-container-high)] flex items-center justify-between">
                        <h3 className="text-lg font-bold font-['Manrope'] flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                            Top Hallucination Risks
                        </h3>
                        <button className="text-xs font-bold text-[var(--primary)] hover:text-[var(--insurai-primary-container)] transition-colors uppercase tracking-wider font-['Inter']">
                            View All Logs
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--insurai-surface-container-low)]">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Query Signature</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Model Version</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter']">Confidence Score</th>
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] font-['Inter'] text-right">Action Evaluated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--insurai-surface-container-highest)]/30">
                                
                                <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">"Water damage limits on policy HX-819"</p>
                                        <p className="text-[10px] text-[var(--insurai-on-surface-variant)] mt-1 font-['Inter'] font-medium">Doc: Homeowner_Comprehensive_v2.pdf</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--insurai-surface-container-highest)] border border-[var(--insurai-outline-variant)]/20 text-[var(--insurai-on-surface-variant)]">
                                            Gemini-Pro-2.0
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 rounded-full bg-[var(--insurai-surface-container-high)] overflow-hidden">
                                                <div className="w-[42%] h-full bg-red-500 rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-bold text-red-600 dark:text-red-400">42%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 border border-[var(--insurai-outline-variant)]/20 hover:bg-[var(--insurai-surface-container)] transition-colors uppercase tracking-wider shadow-sm">
                                            FLAGGED HITL
                                        </button>
                                    </td>
                                </tr>

                                <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-[var(--insurai-on-surface)]">"Does commercial auto cover employee negligence?"</p>
                                        <p className="text-[10px] text-[var(--insurai-on-surface-variant)] mt-1 font-['Inter'] font-medium">Doc: Commercial_Auto_Rideshare_Rider.pdf</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--insurai-surface-container-highest)] border border-[var(--insurai-outline-variant)]/20 text-[var(--insurai-on-surface-variant)]">
                                            Claude-3-Sonnet
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 rounded-full bg-[var(--insurai-surface-container-high)] overflow-hidden">
                                                <div className="w-[68%] h-full bg-amber-500 rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">68%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20 transition-colors uppercase tracking-wider shadow-sm">
                                            RAG RETRIED
                                        </button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Status / Retraining Card */}
                <div className="md:col-span-4 bg-[var(--insurai-surface-container-lowest)] rounded-2xl border border-[var(--insurai-outline-variant)]/10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] p-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-16 -top-16 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                        <span className="material-symbols-outlined text-[200px]">model_training</span>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold font-['Manrope']">Model Retraining Status</h3>
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
                        </div>

                        <div className="bg-[var(--insurai-surface-container-low)] rounded-xl p-4 border border-[var(--insurai-outline-variant)]/10">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-xs font-bold text-[var(--insurai-on-surface)]">Policy_Embedding_v4</p>
                                    <p className="text-[10px] font-['Inter'] text-[var(--insurai-on-surface-variant)] mt-0.5">Epoch 42/100 • Loss: 0.124</p>
                                </div>
                                <span className="text-sm font-black text-[var(--primary)]">42%</span>
                            </div>
                            <div className="w-full h-2 bg-[var(--insurai-surface-container-highest)] rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[42%] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-xs font-['Inter'] text-[var(--insurai-on-surface-variant)] leading-relaxed mb-4">
                            The embedding matrix is being updated utilizing the resolved 640 HITL overrides from the past 14 days, improving semantic correlation for edge-case liability clauses.
                        </p>
                        <button className="w-full py-3 rounded-xl bg-[var(--insurai-on-surface)] text-[var(--insurai-surface)] text-sm font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all font-['Manrope']">
                            View Training Logs
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
