"use client";

import Link from "next/link";
import { useState } from "react";

export default function SystemMonitoringPage() {
    return (
        <div className="flex-1 w-full bg-[var(--insurai-surface)] font-['Manrope'] px-6 md:px-10 py-12">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[var(--insurai-on-surface)] mb-2 font-['Manrope']">
                        System Monitoring
                    </h1>
                    <p className="text-[var(--insurai-on-surface-variant)] max-w-2xl leading-relaxed">
                        Global infrastructure health overview and real-time performance metrics for GraphRAG engines and Neo4j database layers.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-[var(--insurai-surface-container-low)] px-4 py-2 rounded-lg border border-[var(--insurai-outline-variant)]/15">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        <span className="text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider">
                            OPERATIONAL
                        </span>
                    </div>
                    <div className="bg-[var(--insurai-surface-container-lowest)] shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-4 py-2 rounded-lg border border-[var(--insurai-outline-variant)]/15 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
                        <span className="text-xs font-['Inter'] font-medium uppercase tracking-wider text-[var(--insurai-on-surface)]">
                            Last 24 Hours
                        </span>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Latency Metric Card */}
                <div className="md:col-span-4 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10 flex flex-col justify-between h-64 hover:border-[var(--primary)]/20 transition-all">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-['Inter'] font-bold tracking-widest text-[var(--insurai-on-surface-variant)] uppercase mb-1">
                                API Latency
                            </p>
                            <h3 className="text-4xl font-bold font-['Manrope']">
                                124<span className="text-lg text-slate-400 font-normal ml-1">ms</span>
                            </h3>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                            -12%
                        </div>
                    </div>
                    <div className="mt-auto h-24 w-full flex items-end gap-1">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-1/2"></div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-2/3"></div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-3/4"></div>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t-sm h-1/2"></div>
                        <div className="flex-1 bg-blue-100 dark:bg-blue-900/40 rounded-t-sm h-2/3"></div>
                        <div className="flex-1 bg-blue-200 dark:bg-blue-800/60 rounded-t-sm h-4/5"></div>
                        <div className="flex-1 bg-[var(--primary)] shadow-[0_0_10px_rgba(0,82,209,0.3)] rounded-t-sm h-3/5"></div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-1/2"></div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-1/4"></div>
                    </div>
                </div>

                {/* Token Usage Card */}
                <div className="md:col-span-4 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10 flex flex-col justify-between h-64 hover:border-amber-500/20 transition-all">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-['Inter'] font-bold tracking-widest text-[var(--insurai-on-surface-variant)] uppercase mb-1">
                                Token Throughput
                            </p>
                            <h3 className="text-4xl font-bold font-['Manrope']">
                                842.5<span className="text-lg text-slate-400 font-normal ml-1">k/hr</span>
                            </h3>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold">
                            +4.2%
                        </div>
                    </div>
                    <div className="mt-auto relative">
                        <svg className="w-full h-24" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10" fill="none" stroke="var(--primary)" strokeLinecap="round" strokeWidth="3"></path>
                            <path d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10 L400,100 L0,100 Z" fill="url(#gradient-usage)" opacity="0.15"></path>
                            <defs>
                                <linearGradient id="gradient-usage" x1="0%" x2="0%" y1="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="1"></stop>
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Resource Usage Card */}
                <div className="md:col-span-4 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10 flex flex-col justify-between h-64 hover:border-blue-500/20 transition-all">
                    <div className="space-y-6 mt-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] tracking-wider uppercase">CPU Load</span>
                                <span className="text-xs font-bold text-[var(--insurai-on-surface)]">64%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--insurai-surface-container-highest)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: "64%" }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] tracking-wider uppercase">Memory Usage</span>
                                <span className="text-xs font-bold text-[var(--insurai-on-surface)]">42%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--insurai-surface-container-highest)] rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 rounded-full" style={{ width: "42%" }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] tracking-wider uppercase">Storage I/O</span>
                                <span className="text-xs font-bold text-[var(--insurai-on-surface)]">18%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--insurai-surface-container-highest)] rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-full" style={{ width: "18%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Node Pulse - Global Map */}
                <div className="md:col-span-8 bg-[var(--insurai-surface-container-low)] rounded-xl overflow-hidden relative min-h-[500px] border border-[var(--insurai-outline-variant)]/10 shadow-inner group">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
                    <div className="relative z-10 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-xl font-bold font-['Manrope']">Node Pulse</h4>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)] font-['Inter'] mt-1">
                                    Real-time heartbeat of global server clusters
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold shadow-sm z-30">US</div>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold shadow-sm z-20">EU</div>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold shadow-sm z-10">AP</div>
                                </div>
                                <span className="text-xs font-bold text-[var(--primary)] ml-2">9 ACTIVE NODES</span>
                            </div>
                        </div>

                        {/* Map Simulation */}
                        <div className="relative h-80 w-full mt-4 flex items-center justify-center">
                            <div className="absolute inset-0 opacity-40 dark:opacity-20 flex items-center justify-center">
                                {/* Simplified SVG world map outline */}
                                <svg viewBox="0 0 800 400" className="w-full h-full text-slate-400 fill-current opacity-30">
                                    <path d="M150,120 Q180,80 230,100 T300,50 T380,80 T400,200 T350,280 T250,300 T180,250 Z" />
                                    <path d="M420,100 Q480,50 550,80 T650,50 T700,150 T600,280 T500,250 Z" />
                                    <path d="M650,250 Q700,200 750,230 T780,300 T700,350 T650,300 Z" />
                                </svg>
                            </div>

                            {/* Pulse Points */}
                            <div className="absolute top-[30%] left-[22%] group/node">
                                <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-ping absolute opacity-70"></div>
                                <div className="w-3 h-3 bg-[var(--primary)] rounded-full relative z-10 shadow-[0_0_15px_rgba(0,82,209,0.8)]"></div>
                                <div className="absolute top-4 left-4 whitespace-nowrap bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-lg opacity-0 group-hover/node:opacity-100 transition-opacity z-20">US-East (Primary)</div>
                            </div>
                            
                            <div className="absolute top-[28%] left-[65%] group/node">
                                <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-ping absolute opacity-70" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                                <div className="w-3 h-3 bg-[var(--primary)] rounded-full relative z-10 shadow-[0_0_15px_rgba(0,82,209,0.8)]"></div>
                                <div className="absolute top-4 left-4 whitespace-nowrap bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-lg opacity-0 group-hover/node:opacity-100 transition-opacity z-20">EU-West-1</div>
                            </div>
                            
                            <div className="absolute top-[60%] left-[80%] group/node">
                                <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-ping absolute opacity-70" style={{ animationDelay: '1.2s', animationDuration: '2s' }}></div>
                                <div className="w-3 h-3 bg-[var(--primary)] rounded-full relative z-10 shadow-[0_0_15px_rgba(0,82,209,0.8)]"></div>
                                <div className="absolute top-4 left-4 whitespace-nowrap bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-lg opacity-0 group-hover/node:opacity-100 transition-opacity z-20">AP-South-2</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Map Footer Stats */}
                    <div className="absolute bottom-0 w-full bg-white/40 dark:bg-slate-900/60 backdrop-blur-md p-6 grid grid-cols-3 gap-8 border-t border-[var(--insurai-outline-variant)]/10">
                        <div className="text-center">
                            <span className="block text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Packet Loss</span>
                            <span className="text-lg font-bold">0.002%</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Handshake</span>
                            <span className="text-lg font-bold text-[var(--primary)]">14ms</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-xs font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-1">Uptime</span>
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">99.998%</span>
                        </div>
                    </div>
                </div>

                {/* Database Insights Card */}
                <div className="md:col-span-4 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10 flex flex-col justify-between min-h-[500px]">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[var(--primary)]">database</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg font-['Manrope'] mb-0.5">Neo4j Graph Layers</h4>
                                <p className="text-xs text-[var(--insurai-on-surface-variant)] font-['Inter']">GraphRAG Performance</p>
                            </div>
                        </div>

                        <div className="space-y-4 shadow-sm border border-[var(--insurai-outline-variant)]/5 rounded-xl p-2 bg-[var(--insurai-surface-container)]/30">
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg hover:bg-[var(--insurai-surface-container)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[var(--insurai-secondary)] text-[18px]">schema</span>
                                    <span className="text-sm font-semibold">Node Count</span>
                                </div>
                                <span className="font-bold text-[var(--primary)]">4.2M</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg hover:bg-[var(--insurai-surface-container)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[var(--insurai-secondary)] text-[18px]">link</span>
                                    <span className="text-sm font-semibold">Relationships</span>
                                </div>
                                <span className="font-bold text-[var(--primary)]">18.7M</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[var(--insurai-surface-container-low)] rounded-lg hover:bg-[var(--insurai-surface-container)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[var(--insurai-secondary)] text-[18px]">timer</span>
                                    <span className="text-sm font-semibold">Query Speed</span>
                                </div>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">8ms</span>
                            </div>
                        </div>

                        <div className="mt-8 px-2">
                            <p className="text-[10px] font-['Inter'] font-bold text-[var(--insurai-on-surface-variant)] uppercase mb-4 tracking-widest">
                                Cache Hit Ratio
                            </p>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold inline-block py-1 px-2 uppercase rounded-md text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            Optimal
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold inline-block text-[var(--primary)]">
                                            94%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-[var(--insurai-surface-container-high)]">
                                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--primary)] transition-all duration-1000" style={{ width: "94%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-auto text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary)]/5 py-3 rounded-lg border border-[var(--primary)]/20 transition-colors">
                        View Complete Schema
                    </button>
                </div>

                {/* Health Logs Section */}
                <div className="md:col-span-12 bg-[var(--insurai-surface-container-lowest)] p-8 rounded-xl shadow-[0_20px_40px_rgba(26,27,31,0.02)] border border-[var(--insurai-outline-variant)]/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h4 className="text-xl font-bold font-['Manrope']">Infrastructure Logs</h4>
                        <div className="flex gap-2">
                            <span className="px-3 py-1.5 rounded-full bg-[var(--insurai-surface-container-low)] text-[10px] font-bold text-[var(--insurai-on-surface-variant)] cursor-pointer hover:bg-[var(--insurai-surface-container)] transition-colors">SYSTEM</span>
                            <span className="px-3 py-1.5 rounded-full bg-[var(--insurai-surface-container-low)] text-[10px] font-bold text-[var(--insurai-on-surface-variant)] cursor-pointer hover:bg-[var(--insurai-surface-container)] transition-colors">GRAPH</span>
                            <span className="px-3 py-1.5 rounded-full bg-[var(--primary)] text-[10px] font-bold text-white cursor-pointer shadow-md shadow-[var(--primary)]/20">ERROR</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto rounded-lg border border-[var(--insurai-outline-variant)]/10">
                        <table className="w-full text-left bg-[var(--insurai-surface-container-lowest)]">
                            <thead className="bg-[var(--insurai-surface-container-low)] border-b border-[var(--insurai-outline-variant)]/20">
                                <tr>
                                    <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-[10px] font-bold">Timestamp</th>
                                    <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-[10px] font-bold">Component</th>
                                    <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-[10px] font-bold">Event</th>
                                    <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-[10px] font-bold">Status</th>
                                    <th className="px-6 py-4 font-['Inter'] text-[var(--insurai-on-surface-variant)] uppercase tracking-widest text-[10px] font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--insurai-outline-variant)]/10">
                                <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-['Inter'] font-semibold text-[var(--insurai-on-surface-variant)]">2023-11-24 14:02:11</td>
                                    <td className="px-6 py-4 text-xs font-bold text-[var(--insurai-on-surface)]">LLM-Cluster-02</td>
                                    <td className="px-6 py-4 text-xs font-['Inter'] text-[var(--insurai-on-surface-variant)]">Model quantization swap completed successfully.</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded w-fit">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span> SUCCESS
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--primary)]/10 p-1.5 rounded-md hover:bg-[var(--primary)]/20">
                                            <span className="material-symbols-outlined text-[18px]">read_more</span>
                                        </button>
                                    </td>
                                </tr>
                                
                                <tr className="hover:bg-[var(--insurai-surface-container-low)]/50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-['Inter'] font-semibold text-[var(--insurai-on-surface-variant)]">2023-11-24 13:58:45</td>
                                    <td className="px-6 py-4 text-xs font-bold text-[var(--insurai-on-surface)]">Neo4j-Primary</td>
                                    <td className="px-6 py-4 text-xs font-['Inter'] text-[var(--insurai-on-surface-variant)]">Memory pressure detected on index "Policy_Vector".</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded w-fit">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse"></span> WARNING
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--primary)]/10 p-1.5 rounded-md hover:bg-[var(--primary)]/20">
                                            <span className="material-symbols-outlined text-[18px]">read_more</span>
                                        </button>
                                    </td>
                                </tr>
                                
                                <tr className="hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors group relative border-l-2 border-l-red-500">
                                    <td className="px-6 py-4 text-xs font-['Inter'] font-semibold text-[var(--insurai-on-surface-variant)]">2023-11-24 13:42:02</td>
                                    <td className="px-6 py-4 text-xs font-bold text-[var(--insurai-on-surface)]">API-Gateway-US</td>
                                    <td className="px-6 py-4 text-xs font-['Inter'] text-[var(--insurai-on-surface-variant)]">High latency detected in US-East region (240ms).</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded w-fit">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400"></span> CRITICAL
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--primary)]/10 p-1.5 rounded-md hover:bg-[var(--primary)]/20">
                                            <span className="material-symbols-outlined text-[18px]">read_more</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
