"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const steps = [
    { num: "01", label: "Personal", key: "personal" },
    { num: "02", label: "Vehicle", key: "vehicle" },
    { num: "03", label: "Coverage", key: "coverage" },
    { num: "04", label: "Review", key: "review" },
];

export default function NewApplicationPage() {
    const [currentStep, setCurrentStep] = useState(1); // Start at Vehicle step like the design

    return (
        <div className="min-h-screen bg-[var(--insurai-surface)]">
            <Navbar />

            <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-[var(--insurai-surface-container-high)] text-[var(--insurai-on-surface-variant)] text-xs font-bold rounded-full font-[Inter] uppercase tracking-wider">
                                Draft #8291
                            </span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full font-[Inter] uppercase tracking-wider">
                                Pending
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-[Manrope]">
                            Auto Policy Application
                        </h1>
                        <p className="text-[var(--insurai-on-surface-variant)] text-sm mt-2 max-w-xl">
                            Complete the four steps below to receive your personalized quote and binding agreement.
                        </p>
                    </div>
                    <Link href="/portal" className="px-5 py-2.5 border border-[var(--insurai-outline-variant)]/20 rounded-lg text-sm font-medium text-[var(--insurai-on-surface-variant)] hover:bg-[var(--insurai-surface-container-low)] transition-all self-start">
                        Save for later
                    </Link>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center mb-16">
                    {steps.map((step, i) => (
                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                        i < currentStep
                                            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                                            : i === currentStep
                                            ? "bg-white dark:bg-slate-900 border-[var(--primary)] text-[var(--primary)]"
                                            : "bg-white dark:bg-slate-900 border-[var(--insurai-outline-variant)]/30 text-slate-400"
                                    }`}
                                >
                                    {i < currentStep ? (
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    ) : (
                                        step.num
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-semibold mt-2 ${
                                        i <= currentStep ? "text-[var(--primary)]" : "text-slate-400"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {/* Connector Line */}
                            {i < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4 mt-[-20px]">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            i < currentStep ? "bg-[var(--primary)]" : "bg-[var(--insurai-surface-container-high)]"
                                        }`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-8 md:p-10 rounded-2xl ambient-shadow ghost-border">
                            <h2 className="text-2xl font-bold mb-2">Vehicle Information</h2>
                            <p className="text-[var(--insurai-on-surface-variant)] text-sm mb-8">
                                Tell us about the vehicle you&apos;d like to insure. You can add more vehicles later.
                            </p>

                            {/* VIN & License Plate */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                        Vehicle Identification Number (VIN)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="17-digit code"
                                            className="w-full p-4 bg-[var(--insurai-surface-container-highest)]/40 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--insurai-surface-container-lowest)] focus:border-blue-100 outline-none transition-all pr-12"
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--primary)] transition-colors">
                                            <span className="material-symbols-outlined text-lg">photo_camera</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                        License Plate
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ABC-1234"
                                        className="w-full p-4 bg-[var(--insurai-surface-container-highest)]/40 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--insurai-surface-container-lowest)] focus:border-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Year / Make / Model */}
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                        Year
                                    </label>
                                    <select className="w-full p-4 bg-[var(--insurai-surface-container-highest)]/40 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all appearance-none">
                                        <option>2024</option>
                                        <option>2023</option>
                                        <option>2022</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                        Make
                                    </label>
                                    <select className="w-full p-4 bg-[var(--insurai-surface-container-highest)]/40 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all appearance-none">
                                        <option>Tesla</option>
                                        <option>BMW</option>
                                        <option>Mercedes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-2 block">
                                        Model
                                    </label>
                                    <select className="w-full p-4 bg-[var(--insurai-surface-container-highest)]/40 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all appearance-none">
                                        <option>Model S</option>
                                        <option>Model 3</option>
                                        <option>Model Y</option>
                                    </select>
                                </div>
                            </div>

                            {/* Primary Use */}
                            <div className="mb-8">
                                <label className="text-[10px] font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-3 block">
                                    Primary Use
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="p-5 rounded-xl border-2 border-[var(--primary)] bg-blue-50/50 dark:bg-blue-900/10 flex items-center gap-4 text-left transition-all">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-[var(--primary)]">
                                            <span className="material-symbols-outlined">commute</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Personal &amp; Commute</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)]">Daily driving and work travel</p>
                                        </div>
                                    </button>
                                    <button className="p-5 rounded-xl border border-[var(--insurai-outline-variant)]/20 hover:border-[var(--insurai-outline-variant)]/50 flex items-center gap-4 text-left transition-all">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                                            <span className="material-symbols-outlined">business_center</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Business / Rideshare</p>
                                            <p className="text-xs text-[var(--insurai-on-surface-variant)]">Used for commercial purposes</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Previous Step
                            </button>
                            <button
                                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                className="px-10 py-4 primary-gradient text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Continue to Coverage
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar Insights */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Safe Driver Discount */}
                        <div className="bg-[var(--primary)] text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <h4 className="text-xl font-bold mb-2">Safe Driver Discount</h4>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    Based on your record, you&apos;re currently eligible for a 15% reduction in annual premiums.
                                </p>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--insurai-primary-container)] rounded-full blur-3xl opacity-50" />
                        </div>

                        {/* Need Assistance */}
                        <div className="bg-[var(--insurai-surface-container-lowest)] p-6 rounded-2xl ghost-border">
                            <p className="text-xs font-bold uppercase tracking-widest font-[Inter] text-[var(--insurai-on-surface-variant)] mb-4">
                                Need Assistance?
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-[var(--primary)]">
                                        <span className="material-symbols-outlined text-lg">chat</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Live Support</p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)]">Available Mon-Fri, 9am - 5pm</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-[var(--primary)]">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Policy Guide</p>
                                        <p className="text-xs text-[var(--insurai-on-surface-variant)]">Understand your coverage options</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Card */}
                        <div className="rounded-xl overflow-hidden h-48 relative shadow-lg">
                            <img 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                alt="front view of a modern electric car parked in a showroom" 
                                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                                <span className="text-white text-[10px] font-bold tracking-widest uppercase font-['Inter'] mb-1">Coming Next</span>
                                <h4 className="text-white font-bold text-lg">Custom Coverage Plans</h4>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Footer Progress */}
                <div className="mt-8 pt-4 border-t border-[var(--insurai-surface-container-high)] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-xs font-bold text-[var(--insurai-on-surface-variant)] uppercase tracking-wider font-[Inter]">
                            Auto Policy Progress: 45%
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Session ID: AI-2024-X9</span>
                        <Link href="/support#faq" className="text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline">
                            View FAQ
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
