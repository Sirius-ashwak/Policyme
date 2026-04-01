"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[var(--insurai-surface)] text-[var(--insurai-on-surface)]">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 glass-header shadow-[0_1px_0_0_rgba(0,0,0,0.05)] h-16">
                <div className="flex justify-between items-center h-full px-8 max-w-7xl mx-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center shadow-md shadow-blue-200/50">
                            <Logo className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tighter">InsurAI</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-sm text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">Solution</a>
                        <a href="#" className="text-sm text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">Technology</a>
                        <a href="#" className="text-sm text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">Pricing</a>
                        <a href="#" className="text-sm text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">Support</a>
                    </div>
                    <Link href="/portal" className="px-5 py-2.5 primary-gradient text-white rounded-lg text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-40 pb-24 px-8 text-center max-w-4xl mx-auto">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--insurai-on-surface-variant)] mb-6 font-[Inter]">
                    Deterministic AI
                </p>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter font-[Manrope] leading-[0.95] mb-6">
                    Insurance Intelligence,{" "}
                    <br className="hidden md:block" />
                    completely reinvented.
                </h1>
                <p className="text-lg text-[var(--insurai-on-surface-variant)] max-w-xl mx-auto leading-relaxed mb-10">
                    Eliminate hallucinations. Ground every decision in verifiable policy data with high-dimensional GraphRAG architecture.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link href="/portal" className="px-8 py-4 primary-gradient text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                        Request a Demo
                    </Link>
                    <a href="#tech" className="text-sm font-semibold text-[var(--insurai-on-surface-variant)] hover:text-[var(--primary)] transition-colors flex items-center gap-1">
                        Explore the tech
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </a>
                </div>
            </section>

            {/* Product Preview */}
            <section className="px-8 max-w-5xl mx-auto mb-32">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                LIVE
                            </div>
                            <p className="text-slate-400 text-sm font-mono">Tracking #EXCLUSION_WR3</p>
                            <div className="mt-8 bg-slate-800 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-2 font-mono text-[10px] text-slate-500">
                                    <p><span className="text-blue-400">query</span>: flood exclusion §4B</p>
                                    <p><span className="text-green-400">match</span>: 3 clauses found</p>
                                    <p><span className="text-orange-400">confidence</span>: 0.994</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                                        <circle cx="60" cy="60" r="52" stroke="#156aff" strokeWidth="6" fill="none" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * 0}`} strokeLinecap="round" className="confidence-ring" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-extrabold text-white">100%</span>
                                    </div>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Deterministic Confidence</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-sm text-[var(--insurai-on-surface-variant)] mt-6 font-medium">
                    The GraphRAG Advantage
                </p>
                <p className="text-center text-xs text-[var(--insurai-outline)] mt-1 max-w-lg mx-auto">
                    Traditional LLMs estimate answers. InsurAI retrieves factual, structural evidence, mapping every claim to a specific policy node.
                </p>
            </section>

            {/* Zero Hallucination Section */}
            <section className="px-8 max-w-6xl mx-auto mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--insurai-tertiary)] mb-4 font-[Inter]">
                            Immutable Precision
                        </p>
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-4 font-[Manrope]">
                            Zero Hallucination.{" "}
                            <br />
                            Period.
                        </h2>
                        <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                            Our deterministic engine cross-references queries against an immutable knowledge graph of your policy ecosystem. If it&apos;s not in the data, InsurAI won&apos;t invent it.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[var(--primary)] text-6xl">verified</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Underwriting with Proof */}
            <section className="px-8 max-w-6xl mx-auto mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="flex items-center justify-center order-2 md:order-1">
                        <div className="w-32 h-32 bg-[var(--insurai-surface-container-low)] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)] text-6xl">hub</span>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-4 font-[Inter]">
                            Mathematical Logic
                        </p>
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-4 font-[Manrope]">
                            Underwriting with{" "}
                            <br />
                            Proof.
                        </h2>
                        <p className="text-sm text-[var(--insurai-on-surface-variant)] leading-relaxed">
                            Automate risk analysis with exact confidence scores. Every risk-bearing decision comes with a mathematical proof and a direct path to the policy text.
                        </p>
                    </div>
                </div>
            </section>

            {/* Explainable vs Probabilistic */}
            <section className="px-8 max-w-4xl mx-auto mb-32 text-center">
                <h2 className="text-3xl font-extrabold tracking-tighter mb-12 font-[Manrope]">
                    Explainable vs. Probabilistic
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ghost-border text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 font-[Inter]">InsurAI</span>
                        </div>
                        <p className="text-sm text-[var(--insurai-on-surface-variant)] italic mb-4">
                            &quot;Is water damage covered?&quot;
                        </p>
                        <p className="text-sm leading-relaxed">
                            &quot;Generally, water damage is covered if it&apos;s sudden and accidental. Check page 30 mentions clause...&quot;
                        </p>
                    </div>
                    <div className="bg-[var(--insurai-surface-container-lowest)] p-8 rounded-2xl ghost-border text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-[Inter]">Base Model</span>
                        </div>
                        <p className="text-sm text-[var(--insurai-on-surface-variant)] italic mb-4">
                            &quot;Is water damage covered?&quot;
                        </p>
                        <p className="text-sm leading-relaxed">
                            &quot;Per Clause 4.2 Exceptions: subparagraph coverage amounts not exceeding 30 days…&quot;
                        </p>
                        <span className="inline-block mt-3 px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Hallucination
                        </span>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="px-8 max-w-3xl mx-auto mb-32 text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-[Manrope] leading-snug mb-8">
                    &quot;The largest leap in insurance technology since the digital policy. From guesswork to deterministic mapping.&quot;
                </h2>
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-[var(--insurai-surface-container-high)] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[var(--insurai-on-surface-variant)]">person</span>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold">Chief Technology Officer</p>
                        <p className="text-xs text-[var(--insurai-on-surface-variant)]">Fortune 500 Partner</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-8 max-w-4xl mx-auto mb-32">
                <div className="bg-[var(--primary)] text-white rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-[Manrope] mb-8 relative z-10">
                        Experience the truth.
                    </h2>
                    <div className="flex items-center justify-center gap-4 relative z-10">
                        <Link href="/portal" className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold border border-white/30 transition-all">
                            Request a Demo
                        </Link>
                        <Link href="/dashboard/adjuster" className="px-8 py-4 bg-white text-[var(--primary)] rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                            Talk to an Expert
                        </Link>
                    </div>
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-30" />
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20" />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--insurai-surface-container-high)] px-8 py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-lg font-extrabold tracking-tighter mb-3">InsurAI</p>
                        <p className="text-xs text-[var(--insurai-on-surface-variant)] leading-relaxed">
                            Engineering trust through deterministic GraphRAG-driven knowledge mapping.
                        </p>
                    </div>
                    {[
                        { title: "Explore", links: ["Solution", "Technology", "API"] },
                        { title: "Company", links: ["About", "Insights", "Careers"] },
                        { title: "Legal", links: ["Privacy", "Security", "Terms"] },
                    ].map((col) => (
                        <div key={col.title}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--insurai-on-surface-variant)] mb-3">{col.title}</p>
                            <div className="space-y-2">
                                {col.links.map((link) => (
                                    <a key={link} href="#" className="block text-sm text-[var(--insurai-on-surface-variant)] hover:text-[var(--insurai-on-surface)] transition-colors">
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[var(--insurai-surface-container-high)] flex justify-between items-center">
                    <p className="text-xs text-[var(--insurai-outline)]">© 2024 InsurAI. Engineering Truth.</p>
                    <div className="flex gap-4 text-xs text-[var(--insurai-outline)]">
                        <a href="#" className="hover:text-[var(--insurai-on-surface)] transition-colors">Twitter</a>
                        <a href="#" className="hover:text-[var(--insurai-on-surface)] transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
